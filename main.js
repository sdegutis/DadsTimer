const electron = require('electron');
const path = require('path');

function createWindow() {
  let win = new electron.BrowserWindow({
    width: 600,
    height: 600,
    maximizable: false,
    minimizable: false,
    // resizable: false,
  });
  // win.setMenu(null);
  win.loadFile('index.html');
}

electron.app.whenReady().then(createWindow);
