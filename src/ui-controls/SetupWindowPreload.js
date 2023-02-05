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
const SetupWindowBridge = {
    readUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield electron_1.ipcRenderer.invoke('read-userdata').then(JSON.parse);
        });
    },
    writeUserData(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield electron_1.ipcRenderer.invoke('write-userdata', JSON.stringify(userData));
        });
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
