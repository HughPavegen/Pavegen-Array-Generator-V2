console.log('preload.js is loaded');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'ipcRenderer', {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ['save-screenshot'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
  }
);
