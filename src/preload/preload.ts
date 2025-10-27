import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Define the API that will be exposed to the renderer process
interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getSystemInfo: () => Promise<any>;
  showMessage: (message: string) => Promise<string>;
  onMessageFromMain: (callback: (message: string) => void) => void;
}

// Create the API object
const electronAPI: ElectronAPI = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  showMessage: (message: string) => ipcRenderer.invoke('show-message', message),
  onMessageFromMain: (callback: (message: string) => void) => {
    ipcRenderer.on('message-from-main', (event: IpcRendererEvent, message: string) => {
      callback(message);
    });
  }
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

