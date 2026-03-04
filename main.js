const { app, BrowserWindow, Menu, screen } = require('electron'); // 新增screen导入
const path = require('path');

// 解决Electron 20+版本的安全警告
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  // 获取屏幕尺寸（修复screen未定义问题）
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  
  // 创建悬浮窗窗口
  mainWindow = new BrowserWindow({
    width: 420,          // 窗口宽度
    height: 650,         // 窗口高度
    frame: false,        // 去掉系统边框（纯悬浮样式）
    resizable: true,     // 允许调整窗口大小
    alwaysOnTop: true,   // 始终置顶（核心！）
    transparent: false,  // 关闭透明（避免显示异常）
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    // 窗口初始位置（屏幕右上角，修复screen调用逻辑）
    x: screenSize.width - 450,
    y: 50
  });

  // 加载抽人工具页面
  mainWindow.loadFile('index.html');

  // 去掉顶部菜单栏
  Menu.setApplicationMenu(null);

  // 允许窗口拖动（配合HTML中的拖动区域）
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('window-ready');
  });
}

// 应用启动时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}).catch(err => {
  // 捕获启动异常，避免闪退
  console.error('应用启动失败:', err);
});

// 关闭所有窗口时退出应用（Mac除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});