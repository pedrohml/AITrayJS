"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const SplashWindowBridge = {
    closeSplashWindow() {
        electron_1.ipcRenderer.send('splash:close');
    }
};
electron_1.contextBridge.exposeInMainWorld('SplashWindowBridge', SplashWindowBridge);
