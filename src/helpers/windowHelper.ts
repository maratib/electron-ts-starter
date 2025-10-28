import { BrowserWindow } from "electron";
import { Const } from "../lib/Const";
import path from "path";

export class WindowHelper {
  constructor() {}

  setup(): void {
    // Setup window related helpers here
    this.createWindow();
  }

  private createWindow(): void {
    if (Const.mainWindow !== null) return;
    Const.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "../preload/preload.js"),
      },
    });

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      Const.mainWindow.loadFile("index.html");
      Const.mainWindow.webContents.openDevTools();
    } else {
      Const.mainWindow.loadFile("index.html");
    }

    Const.mainWindow.on("close", (event) => {
      //   Const.mainWindow = null; // Dereference the window object
      console.log("MainWindow Close called");
      if (Const.isMac) {
        if (!Const.isQuitting) {
          if (Const.mainWindow !== null) {
            console.log("Hiding the main window on macOS");
            event.preventDefault();
            Const.mainWindow.hide();
          }
        }
      }
    });

    Const.mainWindow.on("closed", () => {
      console.log("MainWindow CloseD called");
      Const.mainWindow = null; // Dereference the window object
    });
  }
}
