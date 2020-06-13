const electron = require('electron');

function createWindow() {
  let win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });
  win.setMenu(null);
  win.loadFile('index.html');
}

electron.app.whenReady().then(createWindow);