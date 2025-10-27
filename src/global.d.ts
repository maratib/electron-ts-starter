// global.d.ts

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    isMac: boolean;
  }
}

// Required if you have import statements in a .d.ts file to make it a module
export {};
