import { App, BrowserWindow, IpcMain } from "electron";

export class IPCHandler {
  constructor(
    private app: App,
    private ipcMain: IpcMain,
    private mainWindow: BrowserWindow | null
  ) {
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    // Example IPC handler
    this.ipcMain.handle("get-app-version", () => {
      return this.app.getVersion();
    });

    // Example IPC handler for system information
    this.ipcMain.handle("get-system-info", () => {
      return {
        platform: process.platform,
        arch: process.arch,
        versions: process.versions,
      };
    });

    // Example IPC handler for file operations
    this.ipcMain.handle("show-message", async (event, message: string) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send(
          "message-from-main",
          `Main process received: ${message}`
        );
      }
      return `Processed: ${message}`;
    });
  }
}
