import { BrowserWindow } from "electron";
import { UserData } from "../UserData";
import settings from 'electron-settings';
import path from "path";
import PromptWindow from "./PromptWindow";

class SetupWindow extends BrowserWindow {
    public userData : UserData;

    constructor(userData: UserData) {
        super({
            width: 650,
            height: 250,
            webPreferences: {
                preload: path.join(__dirname, '../../src/ui-controls/SetupWindowPreload.js'),
            },
            resizable: false
        });
        
        this.userData = userData;

        this.setMenuBarVisibility(false);

        this.loadFile(path.join(__dirname, '../../src/layouts/setup-window.html'));

        this.webContents.ipc.handle('setup-form-submit', async (evt, userData) => await this.submitForm(userData));
        this.webContents.ipc.on('close-setup-window', (evt) => this.close());
        this.webContents.ipc.on('open-macro', (evt, macroIdx) => {
            this.configMacro(macroIdx);
        });
    }

    private async submitForm(userData: UserData) {
        await settings.set('aitray', JSON.parse(JSON.stringify(userData)));
    }

    private async configMacro(macroIdx: number) {
        const userData = await UserData.load();
    
        const promptWindow = new PromptWindow(
            userData.providers!,
            userData.macros[macroIdx],
            { show: true, modal: true, parent: this, title: `AI Prompt (Macro ${macroIdx})` });
    
        promptWindow.onSavePreferences = async (prefs) => {
            const userData = await UserData.load();
            userData.macros[macroIdx] = prefs;
            await userData.save();
        };
    }
}

export default SetupWindow;
module.exports = SetupWindow;