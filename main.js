const electron = require('electron');
const path = require('path');

function createWindow() {
  let win = new electron.BrowserWindow({
    width: 300,
    height: 300,
    maximizable: false,
    minimizable: false,
    minWidth: 200,
  });
  win.setMenu(null);
  win.webContents.toggleDevTools();
  win.loadFile('index.html');
}

electron.app.whenReady().then(createWindow);