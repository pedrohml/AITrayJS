import { contextBridge, ipcRenderer } from "electron";
import { UserData } from "../UserData";

const SetupWindowBridge = {
  async readUserData() : Promise<UserData> {
    return await ipcRenderer.invoke('userdata:read').then(JSON.parse);
  },
  async writeUserData(userData: any) : Promise<void> {
    await ipcRenderer.invoke('userdata:write', JSON.stringify(userData));
  },
  openMacro(macroIdx: number) {
    ipcRenderer.send('setup:open-macro', macroIdx);
  },
  closeSetupWindow() {
    ipcRenderer.send('setup:close');
  }
}

contextBridge.exposeInMainWorld('SetupWindowBridge', SetupWindowBridge);

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
