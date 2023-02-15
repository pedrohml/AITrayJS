import { contextBridge, ipcRenderer } from "electron";

const SplashWindowBridge = {
  closeSplashWindow() {
    ipcRenderer.send('splash:close');
  }
}

contextBridge.exposeInMainWorld('SplashWindowBridge', SplashWindowBridge);