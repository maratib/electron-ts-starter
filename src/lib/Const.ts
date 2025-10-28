import { BrowserWindow } from "electron";

export class Const {
  static isMac: boolean = process.platform === "darwin";
  static isQuitting: boolean = false;
  static mainWindow: BrowserWindow | null = null;
}
