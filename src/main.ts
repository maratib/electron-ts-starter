/**
 * The Main Process is the Node.js environment that runs the main.js file.
 *
 * It's responsible for managing the application's lifecycle, creating and controlling BrowserWindow instances (which are your application windows),
 * and interacting with the operating system (e.g., creating menus, handling system events, accessing the file system).
 *
 * The Main Process has full Node.js API access and can use any Node.js modules or packages installed via npm.
 * There is only one Main Process in an Electron application.
 *
 */

import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import * as path from "path";
import { IPCHandler } from "./ipc-handler";

class App {
  private mainWindow: BrowserWindow | null = null;
  static isMac = process.platform === "darwin";

  constructor() {
    this.setupApp();
  }

  private createMenu() {
    const menuTemplate: MenuItemConstructorOptions[] = [
      {
        label: "File",
        submenu: [
          {
            label: "New",
            accelerator: "CmdOrCtrl+N",
            click: () => console.log("New file"),
          },
          { type: "separator" },
          { label: "Exit", role: "quit" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
        ],
      },
    ];

    if (App.isMac) menuTemplate.unshift({ label: "" });

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createMenu();

      this.createWindow();

      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
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
        preload: path.join(__dirname, "./preload/preload.js"),
      },
    });

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      this.mainWindow.loadFile("index.html");
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile("index.html");
    }
  }

  private setupIpcHandlers(): void {
    new IPCHandler(app, ipcMain, this.mainWindow);
  }
}

// Initialize the app
new App();
