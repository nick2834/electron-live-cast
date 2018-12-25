import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, roomWindow, saloonWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const roomURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#list` :
  `file://${__dirname}/index.html#list`

const saloonURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#saloon` :
  `file://${__dirname}/index.html#saloon`

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 350,
    show: true,
    titleBarStyle: 'hidden',
    resizable: false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createRoom() {
  roomWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 980,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: true,
    title: "实时音视频",
    autoHideMenuBar: true,
    show: false,
    // alwaysOnTop: true,
    hasShadow: true,
    center: true,
    webPreferences: {
      webSecurity: false
    }
  })
  roomWindow.loadURL(roomURL)

  roomWindow.on('closed', () => {
    roomWindow = null
  })
}

function createSaloon() {
  saloonWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 980,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: true,
    title: "实时音视频",
    autoHideMenuBar: true,
    show: false,
    // alwaysOnTop: true,
    hasShadow: true,
    center: true,
    webPreferences: {
      webSecurity: false
    }
  })
  saloonWindow.loadURL(roomURL)

  saloonWindow.on('closed', () => {
    saloonWindow = null
  })
}
app.on('ready', () => {
  createWindow()
  createRoom()
  createSaloon()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null && roomWindow === null) {
    createWindow()
    createRoom()
    createSaloon()
  }

})
//房间列表通信
ipcMain.on('roomList', (evt, data) => {
  mainWindow.close()
  saloonWindow.close()
  roomWindow.show()
  roomWindow.webContents.send('user-access', data)
});
//房间信息通信
ipcMain.on('saloonDetail', (evt, data) => {
  console.log(data)
  mainWindow.close()
  roomWindow.close()
  saloonWindow.show()
  saloonWindow.webContents.send('room-access', data)
});
//返回通信
ipcMain.on('backRoom', (evt, data) => {
  roomWindow.webContents.send('user-access', data)
});

ipcMain.on('win-minimize', () => {
  roomWindow.minimize()
})

ipcMain.on('win-close', () => {
  app.quit()
})