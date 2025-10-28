import { app, ipcMain } from "electron";
import { Const } from "../lib/Const";

export class IpcHelper {
  constructor() {}
  setup(): void {
    // Setup IPC related helpers here
    this.createHandlers();
  }

  private createHandlers(): void {
    // Example IPC handler
    ipcMain.handle("get-app-version", () => {
      return app.getVersion();
    });

    // Example IPC handler for system information
    ipcMain.handle("get-system-info", () => {
      return {
        platform: process.platform,
        arch: process.arch,
        versions: process.versions,
      };
    });

    // Example IPC handler for file operations
    ipcMain.handle("show-message", async (event, message: string) => {
      if (Const.mainWindow) {
        Const.mainWindow.webContents.send(
          "message-from-main",
          `Main process received: ${message}`
        );
      }
      return `Processed: ${message}`;
    });
  }
}
