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
        return electron_1.ipcRenderer.invoke('prompt:submit-form', formData);
    },
    readFromClipboard() {
        return electron_1.ipcRenderer.sendSync('clipboard:read-text');
    },
    readUserData() {
        return electron_1.ipcRenderer.invoke('userdata:read').then(JSON.parse);
    },
    writeUserData(userData) {
        return electron_1.ipcRenderer.invoke('userdata:write', userData);
    },
    isSaveEnabled() {
        return electron_1.ipcRenderer.sendSync('prompt:is-save-enabled');
    },
    getProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield electron_1.ipcRenderer.invoke('prompt:get-providers'));
        });
    },
    getPreferences() {
        return JSON.parse(electron_1.ipcRenderer.sendSync('prompt:get-preferences'));
    },
    setPreferences(prefs) {
        return electron_1.ipcRenderer.invoke('prompt:set-preferences', JSON.stringify(prefs));
    },
    savePreferences(prefs) {
        return electron_1.ipcRenderer.invoke('prompt:save-preferences', JSON.stringify(prefs));
    },
    shouldExecuteOnStartup() {
        return electron_1.ipcRenderer.sendSync('prompt:should-execute-on-startup');
    },
    isWindowVisible() {
        return electron_1.ipcRenderer.sendSync('prompt:is-visible');
    },
    focusWindow() {
        electron_1.ipcRenderer.send('prompt:focus');
    },
    closePromptWindow() {
        electron_1.ipcRenderer.send('prompt:close');
    },
    setAlwaysOnTop(flag) {
        electron_1.ipcRenderer.send('prompt:set-always-on-top', flag);
    }
};
electron_1.contextBridge.exposeInMainWorld('PromptWindowBridge', PromptWindowBridge);
// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {});
