import {
  app,
  BrowserWindow,
  ipcMain,
  screen,

} from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let loginWindow, mainWindow
const loginUrl = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`;

const mainURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#/main` :
  `file://${__dirname}/index.html#main`;

function createLogin() {
  loginWindow = new BrowserWindow({
    height: 330,
    useContentSize: true,
    width: 429,
    // frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: true,
    title: "实时音视频",
    autoHideMenuBar: true,
    show: true,
    hasShadow: true,
    center: true
  });

  loginWindow.loadURL(loginUrl)

  loginWindow.on('closed', () => {
    loginWindow = null
  })
}

function createMain() {
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 980,
    show: false,
    titleBarStyle: 'hidden',
    resizable: false
  })
  mainWindow.loadURL(mainURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.on('ready', () => {
  const {
    width,
    height
  } = screen.getPrimaryDisplay().workAreaSize
  createLogin()
  // main(width, height)
  createMain()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (loginWindow === null && mainWindow == null) {
    createLogin()
    createMain()
  }
})
ipcMain.on('main-window',(event,data) =>{
  console.log(data)
  loginWindow.close()
  mainWindow.show()
  mainWindow.webContents.send('query', data)
})
ipcMain.on('status', (evt, data) => {
  console.log(data)
  if (data) {
    loginWindow.close()
    mainWindow.show()
  } else {
    app.quit()
  }
});
// ipcMain.on('open-window', e => {
//   const {
//     width,
//     height
//   } = screen.getPrimaryDisplay().workAreaSize
//   mainWindow.setSize(width, height)
//   //   mainWindow.setFullScreen(true)
// })