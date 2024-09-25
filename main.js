const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const iconPath = process.platform === 'darwin'
    ? path.join(__dirname, 'assets', 'App_Icon_Folder', 'icon.icns')
    : path.join(__dirname, 'assets', 'App_Icon_Folder', 'icon.ico');

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // This should be the correct path to your preload.js file
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('save-screenshot', (event, { dataUrl, width, length }) => {
    const data = dataUrl.replace(/^data:image\/png;base64,/, '');
    dialog.showSaveDialog({
        title: 'Save Screenshot',
        // Use width and length to generate the default file name
        defaultPath: path.join(app.getPath('desktop'), `${width} tiles wide ${length} tiles long V3.5 Pavegen array.png`),
        buttonLabel: 'Save',
        filters: [
            { name: 'Images', extensions: ['png'] }
        ]
    }).then(file => {
        if (!file.canceled && file.filePath) {
            fs.writeFile(file.filePath, data, 'base64', (err) => {
                if (err) {
                    console.error('Failed to save screenshot', err);
                } else {
                    console.log('Screenshot saved successfully.');
                }
            });
        }
    }).catch(err => {
        console.error('Failed to save screenshot', err);
    });
});
  
