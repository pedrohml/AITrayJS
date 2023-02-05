import { PromptWindowPrefs, UserData } from "UserData";
import { contextBridge, ipcRenderer } from "electron";
import IProvider from "providers/IProvider";

const PromptWindowBridge = {
  submitForm (formData: any) {
    return ipcRenderer.invoke('prompt:submit-form', formData);
  },
  readFromClipboard() {
    return ipcRenderer.sendSync('clipboard:read-text');
  },
  readUserData() {
    return ipcRenderer.invoke('userdata:read').then(JSON.parse);
  },
  writeUserData(userData: any) {
    return ipcRenderer.invoke('userdata:write', userData);
  },
  isSaveEnabled() {
    return ipcRenderer.sendSync('prompt:is-save-enabled');
  },
  async getProviders() : Promise<IProvider[]> {
    return JSON.parse(await ipcRenderer.invoke('prompt:get-providers'));
  },
  getPreferences() : IProvider[] {
    return JSON.parse(ipcRenderer.sendSync('prompt:get-preferences'));
  },
  setPreferences(prefs: PromptWindowPrefs) : void {
    ipcRenderer.send('prompt:set-preferences', JSON.stringify(prefs));
  },
  shouldExecuteOnStartup(): boolean {
    return ipcRenderer.sendSync('prompt:should-execute-on-startup');
  },
  isWindowVisible(): boolean {
    return ipcRenderer.sendSync('prompt:is-visible');
  },
  focusWindow(): void {
    ipcRenderer.send('prompt:focus');
  },
  closePromptWindow() {
    ipcRenderer.send('prompt:close');
  },
  setAlwaysOnTop(flag: boolean) {
    ipcRenderer.send('prompt:set-always-on-top', flag);
  }
}

contextBridge.exposeInMainWorld('PromptWindowBridge', PromptWindowBridge);

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
