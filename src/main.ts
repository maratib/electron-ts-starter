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

import { app, BrowserWindow } from "electron";
import { IpcHelper, MenuHelper, WindowHelper } from "./helpers";
import { Const } from "./lib/Const";

class Main {
  constructor() {
    this.setupApp();
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      new MenuHelper().setup();
      console.log("MainWindow : ", Const.mainWindow);
      new WindowHelper().setup();
      app.on("activate", () => {
        console.log("app-activate called");
        if (Const.mainWindow === null) {
          console.log("calling Const.mainWindow : 1");
          new WindowHelper().setup();
        } else {
          console.log("calling Const.mainWindow : ");
          Const.mainWindow!.show();
        }
      });
    });

    app.on("window-all-closed", () => {
      console.log("window-all-closed");
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("before-quit", () => {
      Const.isQuitting = true;
    });

    // this.setupIpcHandlers();
    new IpcHelper().setup();
  }
}

// Initialize the app
new Main();
