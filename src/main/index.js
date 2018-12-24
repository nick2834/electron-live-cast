import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, roomWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const roomURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#room` :
  `file://${__dirname}/index.html#room`

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

app.on('ready', () => {
  createWindow()
  createRoom()
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
  }

})

ipcMain.on('checkUsers',(e,user) =>{
  if(user){

  }else{
    roomWindow.close()
    mainWindow.show()
  }
})

ipcMain.on('roomList', (evt, data) => {
  mainWindow.close()
  roomWindow.show()
  roomWindow.webContents.send('user-access', data)
});

ipcMain.on('backRoom', (evt, data) => {
  roomWindow.webContents.send('user-access', data)
});
ipcMain.on('status', (evt, data) => {
  console.log(data)
  if (data) {
    mainWindow.close()
    roomWindow.show()
  } else {
    app.quit()
  }
});

ipcMain.on('win-minimize',() =>{
  roomWindow.minimize()
})

ipcMain.on('win-close',() =>{
  app.quit()
})
