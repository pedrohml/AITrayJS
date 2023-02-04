"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const PromptWindowBridge = {
    submitForm(formData) {
        return electron_1.ipcRenderer.invoke('prompt-form-submit', formData);
    },
    readFromClipboard() {
        return electron_1.ipcRenderer.sendSync('clipboard-readtext');
    },
    readUserDataSync() {
        return JSON.parse(electron_1.ipcRenderer.sendSync('read-userdata-sync'));
    },
    readUserData() {
        return electron_1.ipcRenderer.invoke('read-userdata').then(JSON.parse);
    },
    writeUserData(userData) {
        return electron_1.ipcRenderer.invoke('write-userdata', userData);
    },
    getProviders() {
        return JSON.parse(electron_1.ipcRenderer.sendSync('get-providers'));
    },
    getPreferences() {
        return JSON.parse(electron_1.ipcRenderer.sendSync('get-preferences'));
    },
    setPreferences(prefs) {
        electron_1.ipcRenderer.send('set-preferences', JSON.stringify(prefs));
    },
    shouldExecuteOnStartup() {
        return electron_1.ipcRenderer.sendSync('should-execute-on-startup');
    },
    closePromptWindow() {
        electron_1.ipcRenderer.send('close-prompt-window');
    },
    setAlwaysOnTop(flag) {
        electron_1.ipcRenderer.send('set-always-on-top', flag);
    },
    shutdown() {
        electron_1.ipcRenderer.send('shutdown');
    }
};
electron_1.contextBridge.exposeInMainWorld('PromptWindowBridge', PromptWindowBridge);
// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
