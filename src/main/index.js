import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  
} from 'electron'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 330,
    useContentSize: true,
    width: 429,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: true,
    title: "实时音视频",
    autoHideMenuBar: true,
    show: true,
    // alwaysOnTop: true,
    hasShadow: true,
    center: true
  });

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('open-window', e => {
  const {
    width,
    height
  } = screen.getPrimaryDisplay().workAreaSize
  mainWindow.setSize(width, height)
  //   mainWindow.setFullScreen(true)
})
ipcMain.on('win-fullscreen', e => {
  mainWindow.setFullScreen(true)
})
ipcMain.on('back-Login', e => {
  mainWindow.setFullScreen(false)
  mainWindow.setSize(429, 330)
})
ipcMain.on('close', e => {
  mainWindow.close()
})
ipcMain.on('win-minimize', e => {
  //   console.log(e)
  //   mainWindow.setFullScreen(false)
  mainWindow.minimize()
})