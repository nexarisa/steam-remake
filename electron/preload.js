const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('minimize-app'),
  maximize: () => ipcRenderer.send('maximize-app'),
  close: () => ipcRenderer.send('close-app'),
  
  getSystemSpecs: () => ipcRenderer.invoke('get-system-specs'),
  getInstalledGames: () => ipcRenderer.invoke('get-installed-games'),
  searchSteam: (query) => ipcRenderer.invoke('search-steam', query),
  getGameDetails: (appId) => ipcRenderer.invoke('get-game-details', appId),
  launchGame: (appId) => ipcRenderer.send('launch-game', appId),
  
  // İŞTE YAPAY ZEKA KÖPRÜSÜ
  getAiFps: (gpu, gameTitle) => ipcRenderer.invoke('get-ai-fps', gpu, gameTitle)
});