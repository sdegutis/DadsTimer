const electron = require('electron');

function createWindow() {
  let win = new electron.BrowserWindow({
    width: 300,
    height: 300,
    maximizable: false,
    minimizable: false,
    minWidth: 200,
    alwaysOnTop: true,
  });
  win.setMenu(null);
  // win.webContents.toggleDevTools();
  win.loadFile('index.html');
}

electron.app.whenReady().then(createWindow);
