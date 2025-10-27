import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

class App {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.setupApp();
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createWindow();
      
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    this.setupIpcHandlers();
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, './preload/preload.js')
      }
    });

    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile('index.html');
    }
  }

  private setupIpcHandlers(): void {
    // Example IPC handler
    ipcMain.handle('get-app-version', () => {
      return app.getVersion();
    });

    // Example IPC handler for system information
    ipcMain.handle('get-system-info', () => {
      return {
        platform: process.platform,
        arch: process.arch,
        versions: process.versions
      };
    });

    // Example IPC handler for file operations
    ipcMain.handle('show-message', async (event, message: string) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('message-from-main', `Main process received: ${message}`);
      }
      return `Processed: ${message}`;
    });
  }
}

// Initialize the app
new App();

 