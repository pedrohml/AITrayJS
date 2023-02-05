import { contextBridge, ipcRenderer } from "electron";
import { UserData } from "../UserData";

const SetupWindowBridge = {
  async readUserData() : Promise<UserData> {
    return await ipcRenderer.invoke('read-userdata').then(JSON.parse);
  },
  async writeUserData(userData: any) : Promise<void> {
    await ipcRenderer.invoke('write-userdata', JSON.stringify(userData));
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
