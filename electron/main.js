import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import si from 'systeminformation';
import axios from 'axios';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.setAppUserModelId("Steam Remake");
app.setName("Steam Remake");

let globalAppList = [];

async function fetchGlobalAppList() {
    try {
        const res = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        if (res.data && res.data.applist) {
            globalAppList = res.data.applist.apps;
        }
    } catch (e) {
        console.error("[ERROR] Failed to fetch global app list.");
    }
}

function createWindow() {
  fetchGlobalAppList();

  mainWindow = new BrowserWindow({
    width: 1600, height: 980,
    backgroundColor: '#171d25',
    frame: false,
    title: "Steam Remake", 
    icon: path.join(__dirname, 'steam_icon.png.png'), 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    },
  });

  mainWindow.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });

  // EXE DOSYASI İÇİN YÖNLENDİRME PROTOKOLÜ
  if (app.isPackaged) {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
      mainWindow.loadURL('http://localhost:5173');
  }

  ipcMain.handle('get-system-specs', async () => {
    try {
      const gpu = await si.graphics();
      const cpu = await si.cpu();
      const mem = await si.mem();
      const os = await si.osInfo();
      return {
        gpu: gpu.controllers[0]?.model || "Bilinmiyor",
        cpu: cpu.brand || "Bilinmiyor",
        ram: Math.round(mem.total / 1024 / 1024 / 1024) + " GB",
        os: os.distro + " " + os.release
      };
    } catch (e) { return null; }
  });

  ipcMain.on('launch-game', (event, args) => {
    if (args && args.action === 'install') {
        shell.openExternal(`steam://install/${args.appId}`);
    } else {
        shell.openExternal(`steam://run/${args.appId}`);
    }
  });

  ipcMain.handle('get-installed-games', async () => {
    const steamPaths = ['C:\\Program Files (x86)\\Steam', 'C:\\Steam', 'D:\\Steam', 'D:\\SteamLibrary', 'E:\\Steam', 'E:\\SteamLibrary'];
    let gamesMap = new Map();
    let localConfigData = "";

    try {
        for (const steamPath of steamPaths) {
          const userdataPath = path.join(steamPath, 'userdata');
          if (fs.existsSync(userdataPath)) {
              const users = fs.readdirSync(userdataPath);
              for(const user of users) {
                const configPath = path.join(userdataPath, user, 'config', 'localconfig.vdf');
                if(fs.existsSync(configPath)) localConfigData += fs.readFileSync(configPath, 'utf-8');
              }
          }
        }
    } catch (err) {}

    const getRealPlayData = (appId) => {
        let playtime = 0; let lastPlayed = 0;
        try {
            if(!localConfigData) return { playtime, lastPlayed };
            const appIndex = localConfigData.indexOf(`"${appId}"`);
            if(appIndex !== -1) {
                const chunk = localConfigData.substring(appIndex, appIndex + 600); 
                const ptMatch = chunk.match(/"Playtime"\s*"(\d+)"/i);
                const lpMatch = chunk.match(/"LastPlayed"\s*"(\d+)"/i);
                if(ptMatch) playtime = parseInt(ptMatch[1]); 
                if(lpMatch) lastPlayed = parseInt(lpMatch[1]); 
            }
        } catch(e) {}
        return { playtime, lastPlayed };
    };

    const getAppName = (appId, fallbackName) => {
        const found = globalAppList.find(app => app.appid.toString() === appId.toString());
        return found ? found.name : fallbackName;
    };

    try {
        for (const steamPath of steamPaths) {
          const appsPath = path.join(steamPath, 'steamapps');
          if (fs.existsSync(appsPath)) {
              const files = fs.readdirSync(appsPath);
              const manifestFiles = files.filter(f => f.startsWith('appmanifest_') && f.endsWith('.acf'));
              for (const file of manifestFiles) {
                const content = fs.readFileSync(path.join(appsPath, file), 'utf-8');
                const nameMatch = content.match(/"name"\s+"(.*?)"/);
                const idMatch = content.match(/"appid"\s+"(\d+)"/);
                const sizeMatch = content.match(/"SizeOnDisk"\s+"(\d+)"/);
                
                if (nameMatch && idMatch) {
                  const appId = idMatch[1];
                  const { playtime, lastPlayed } = getRealPlayData(appId);
                  
                  let sizeFormat = "Bilinmiyor";
                  if (sizeMatch) {
                      const bytes = parseInt(sizeMatch[1]);
                      if (bytes > 1073741824) sizeFormat = (bytes / 1073741824).toFixed(2) + " GB";
                      else sizeFormat = (bytes / 1048576).toFixed(2) + " MB";
                  }

                  const finalName = getAppName(appId, nameMatch[1]);

                  gamesMap.set(appId, {
                    id: appId, title: finalName, installed: true, playtime: playtime, lastPlayed: lastPlayed, size: sizeFormat,
                    icon: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`,
                    logo: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/logo.png`, 
                    img: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`,
                    header: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`
                  });
                }
              }
          }
        }
    } catch (err) {}

    try {
        if(localConfigData) {
            const regex = /"(\d{3,7})"\s+\{/g; let match; let count = 0;
            while ((match = regex.exec(localConfigData)) !== null && count < 100) { 
                const appId = match[1];
                if(!gamesMap.has(appId) && appId !== "730" && appId !== "753") { 
                    const { playtime, lastPlayed } = getRealPlayData(appId);
                    const finalName = getAppName(appId, `Steam ID: ${appId}`);

                    gamesMap.set(appId, {
                        id: appId, title: finalName, installed: false, playtime: playtime, lastPlayed: lastPlayed, size: "Bulut",
                        icon: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`,
                        logo: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/logo.png`,
                        img: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`,
                        header: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`
                    });
                    count++;
                }
            }
        }
    } catch (e) {}

    return Array.from(gamesMap.values());
  });

  ipcMain.handle('get-game-details', async (event, appId) => {
    try {
        const res = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=TR&l=turkish`, { timeout: 8000 });
        if(res.data && res.data[appId] && res.data[appId].success) return res.data[appId].data;
        return null;
    } catch (e) { return null; }
  });

  ipcMain.handle('search-steam', async (event, query) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${query}&cc=TR&l=turkish`);
      let items = response.data.items || [];
      return items.filter(game => !game.name.toLowerCase().includes('dlc') && !game.name.toLowerCase().includes('pack'));
    } catch (e) { return []; }
  });

  ipcMain.on('minimize-app', () => mainWindow.minimize());
  ipcMain.on('maximize-app', () => mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize());
  ipcMain.on('close-app', () => app.quit());
}

app.whenReady().then(createWindow);