import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { platform } from "process";
import path from "path";

export class BaseWindow extends BrowserWindow {
    constructor(opts: BrowserWindowConstructorOptions, hideOnClose: boolean) {
        super({
            ...opts,
            ...{
                icon: path.join(__dirname, `../../public/images/${platform != 'win32' ? 'logo.png' : 'logo.ico' }`)
            }
        });

        this.on('close', (event) => {
            if (hideOnClose) {
                event.preventDefault();
                this.hide();
            }
        });
    }
}