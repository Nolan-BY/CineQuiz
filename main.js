
const { app, BrowserWindow, globalShortcut } = require('electron')
// const { autoUpdater, AppUpdater  } = require("electron-updater")

// autoUpdater.autoDownload = false;
// autoUpdater.autoInstallOnAppQuit = true;

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: __dirname + '/assets/images/logo.ico',
    webPreferences: {
      devTools: false,
      // preload: __dirname + '/js/preload.js',
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // autoUpdater.checkForUpdates();
});

/*New Update Available*/
// autoUpdater.on("update-available", (info) => {
//   autoUpdater.downloadUpdate();
// });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {});
  globalShortcut.register("F5", () => {});
});

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
});