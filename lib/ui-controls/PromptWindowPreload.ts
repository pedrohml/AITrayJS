import { PromptWindowPrefs, UserData } from "UserData";
import { contextBridge, ipcRenderer } from "electron";
import IProvider from "providers/IProvider";

const PromptWindowBridge = {
  submitForm (formData: any) {
    return ipcRenderer.invoke('prompt-form-submit', formData);
  },
  readFromClipboard() {
    return ipcRenderer.sendSync('clipboard-readtext');
  },
  readUserDataSync() : UserData {
    return JSON.parse(ipcRenderer.sendSync('read-userdata-sync'));
  },
  readUserData() {
    return ipcRenderer.invoke('read-userdata').then(JSON.parse);
  },
  writeUserData(userData: any) {
    return ipcRenderer.invoke('write-userdata', userData);
  },
  isSaveEnabled() {
    return ipcRenderer.sendSync('is-prompt-save-enabled');
  },
  async getProviders() : Promise<IProvider[]> {
    return JSON.parse(await ipcRenderer.invoke('get-providers'));
  },
  getPreferences() : IProvider[] {
    return JSON.parse(ipcRenderer.sendSync('get-preferences'));
  },
  setPreferences(prefs: PromptWindowPrefs) : void {
    ipcRenderer.send('set-preferences', JSON.stringify(prefs));
  },
  shouldExecuteOnStartup(): boolean {
    return ipcRenderer.sendSync('should-execute-on-startup');
  },
  isWindowVisible(): boolean {
    return ipcRenderer.sendSync('prompt-window-is-visible');
  },
  focusWindow(): void {
    ipcRenderer.send('prompt-window-focus');
  },
  closePromptWindow() {
    ipcRenderer.send('close-prompt-window');
  },
  setAlwaysOnTop(flag: boolean) {
    ipcRenderer.send('set-always-on-top', flag);
  },
  shutdown() {
    ipcRenderer.send('shutdown');
  }
}

contextBridge.exposeInMainWorld('PromptWindowBridge', PromptWindowBridge);

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
