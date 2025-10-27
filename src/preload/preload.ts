/**
 * A preload script is a JavaScript file that runs in the renderer process before its web content (HTML, CSS, and other renderer-specific JavaScript) begins loading.
 *
 * The key characteristic of a preload script is that it runs in the same global context as the renderer process but with access to Node.js APIs.
 * This creates a bridge between the secure, isolated renderer environment and the more privileged Node.js environment.
 *
 * Preload scripts are typically used to:
 * Securely expose specific Node.js APIs or functionalities to the renderer process: This is done using contextBridge.exposeInMainWorld,
 * which creates a secure, isolated API that the renderer can interact with without direct access to Node.js.
 *
 * Perform initial setup or configuration within the renderer's context before the main web content loads.
 * Set up inter-process communication (IPC) channels: between the renderer and the main process, allowing them to exchange messages and data.
 *
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// Define the API that will be exposed to the renderer process
interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getSystemInfo: () => Promise<any>;
  showMessage: (message: string) => Promise<string>;
  onMessageFromMain: (callback: (message: string) => void) => void;
}

// Create the API object
const electronAPI: ElectronAPI = {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),
  showMessage: (message: string) => ipcRenderer.invoke("show-message", message),
  onMessageFromMain: (callback: (message: string) => void) => {
    ipcRenderer.on(
      "message-from-main",
      (event: IpcRendererEvent, message: string) => {
        callback(message);
      }
    );
  },
};

const isMac: boolean = process.platform === "darwin";

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
contextBridge.exposeInMainWorld("isMac", isMac);
