"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const SetupWindowBridge = {
    readUserData() {
        return electron_1.ipcRenderer.invoke('read-userdata').then(JSON.parse);
    },
    writeUserData(userData) {
        return electron_1.ipcRenderer.invoke('write-userdata', userData);
    },
    openMacro(macroIdx) {
        electron_1.ipcRenderer.send('open-macro', macroIdx);
    },
    closeSetupWindow() {
        electron_1.ipcRenderer.send('close-setup-window');
    }
};
electron_1.contextBridge.exposeInMainWorld('SetupWindowBridge', SetupWindowBridge);
// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
