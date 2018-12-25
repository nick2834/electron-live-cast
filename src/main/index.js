import {
  app,
  BrowserWindow,
  ipcMain,
  Menu  
} from 'electron'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let loginWindow, roomWindow
const loginRL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const roomURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#room` :
  `file://${__dirname}/index.html#room`

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    height: 660,
    useContentSize: true,
    width: 300,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: true,
    title: "实时音视频",
    autoHideMenuBar: true,
    show: true,
    hasShadow: true,
    center: true,
    webPreferences: {
      webSecurity: false
    }
  })
  // loginWindow.webContents.openDevTools();
  loginWindow.loadURL(loginRL)

  loginWindow.on('closed', () => {
    loginWindow = null
  })

  var template = [{
    label: "Application",
    submenu: [
      { label: "关于", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "退出", accelerator: "Command+Q", click: function () { app.quit(); } }
    ]
  }, {
    label: "编辑",
    submenu: [
      { label: "撤回", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "重做", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "剪切", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "全选", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createRoomWindow() {
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
    hasShadow: true,
    center: true,
    webPreferences: {
      webSecurity: false
    }
  })
  // roomWindow.webContents.openDevTools();
  roomWindow.loadURL(roomURL)

  roomWindow.on('closed', () => {
    roomWindow = null
  })
}

app.on('ready', () => {
  createLoginWindow()
  createRoomWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (loginWindow === null && roomWindow === null) {
    createLoginWindow()
    createRoomWindow()
  }

})
//房间列表通信
ipcMain.on('roomList', (evt, data) => {
  loginWindow.close()
  roomWindow.show()
  roomWindow.webContents.send('user-access', data)
});
ipcMain.on('login-minimize', () => {
  loginWindow.minimize()
})
ipcMain.on('win-minimize', () => {
  roomWindow.minimize()
})

ipcMain.on('win-close', () => {
  app.quit()
})