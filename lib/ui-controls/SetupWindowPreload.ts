import { contextBridge, ipcRenderer } from "electron";

const SetupWindowBridge = {
  readUserData() {
    return ipcRenderer.invoke('read-userdata').then(JSON.parse);
  },
  writeUserData(userData: any) {
    return ipcRenderer.invoke('write-userdata', userData);
  },
  openMacro(macroIdx: number) {
    ipcRenderer.send('open-macro', macroIdx);
  },
  closeSetupWindow() {
    ipcRenderer.send('close-setup-window');
  }
}

contextBridge.exposeInMainWorld('SetupWindowBridge', SetupWindowBridge);

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
