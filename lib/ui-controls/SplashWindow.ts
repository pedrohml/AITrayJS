import { BrowserWindow } from "electron";
import path from "path";

export class SplashWindow extends BrowserWindow {
    constructor() {
        super({
            width: 400,
            height: 245,
            webPreferences: {
                preload: path.join(__dirname, './SplashWindowPreload.js'),
            },
            resizable: false,
            titleBarStyle: "hidden"
        });

        this.setMenuBarVisibility(false);

        this.loadFile(path.join(__dirname, '../../layouts/splash-window.html'));

        this.webContents.ipc.on('splash:close', () => {
            this.close();
        });
    }
}