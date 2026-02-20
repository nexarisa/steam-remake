const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('minimize-app'),
  maximize: () => ipcRenderer.send('maximize-app'),
  close: () => ipcRenderer.send('close-app'),
  
  getSystemSpecs: () => ipcRenderer.invoke('get-system-specs'),
  getInstalledGames: () => ipcRenderer.invoke('get-installed-games'),
  searchSteam: (query) => ipcRenderer.invoke('search-steam', query),
  getGameDetails: (appId) => ipcRenderer.invoke('get-game-details', appId), // YENİ
  launchGame: (appId) => ipcRenderer.send('launch-game', appId)
});