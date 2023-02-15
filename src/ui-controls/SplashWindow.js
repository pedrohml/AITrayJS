"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
class SplashWindow extends electron_1.BrowserWindow {
    constructor() {
        super({
            width: 400,
            height: 245,
            webPreferences: {
                preload: path_1.default.join(__dirname, '../../src/ui-controls/SplashWindowPreload.js'),
            },
            resizable: false,
            titleBarStyle: "hidden"
        });
        this.setMenuBarVisibility(false);
        this.loadFile(path_1.default.join(__dirname, '../../src/layouts/splash-window.html'));
        this.webContents.ipc.on('splash:close', () => {
            this.close();
        });
    }
}
exports.default = SplashWindow;
module.exports = SplashWindow;
