const electron = require('electron');

function createWindow() {
  let win = new electron.BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 200,
    minHeight: 200,
    maximizable: false,
    minimizable: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: '#000',
    frame: false,
  });
  win.setMenu(null);
  // win.webContents.toggleDevTools();
  win.loadFile('index.html');
}

electron.app.whenReady().then(createWindow);
