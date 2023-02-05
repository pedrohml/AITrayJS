"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    isSaveEnabled() {
        return electron_1.ipcRenderer.sendSync('is-prompt-save-enabled');
    },
    getProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield electron_1.ipcRenderer.invoke('get-providers'));
        });
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
    isWindowVisible() {
        return electron_1.ipcRenderer.sendSync('prompt-window-is-visible');
    },
    focusWindow() {
        electron_1.ipcRenderer.send('prompt-window-focus');
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
