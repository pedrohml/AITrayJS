import { BrowserWindow } from "electron";
import { PromptWindowPrefs, UserData } from "../UserData";
import path from "path";
import PromptWindow from "./PromptWindow";
import { ProviderFactory } from "../providers/ProviderFactory";

class SetupWindow extends BrowserWindow {
    public userData : UserData;

    constructor(userData: UserData) {
        super({
            width: 650,
            height: 250,
            webPreferences: {
                preload: path.join(__dirname, './SetupWindowPreload.js'),
            },
            resizable: false
        });
        
        this.userData = userData;

        this.setMenuBarVisibility(false);

        this.loadFile(path.join(__dirname, '../../layouts/setup-window.html'));

        this.webContents.ipc.on('setup:close', (evt) => this.close());
        this.webContents.ipc.on('setup:open-macro', (evt, macroIdx) => {
            this.configMacro(macroIdx);
        });
    }

    private async configMacro(macroIdx: number) {
        const userData = await UserData.load();
    
        const promptWindow = new PromptWindow(
            new ProviderFactory(),
            new PromptWindowPrefs({ ...userData.macros[macroIdx], ...userData.mainPromptWindowPrefs.getBounds() }),
            { show: true, modal: true, parent: this, title: `AI Prompt (Macro ${macroIdx})` }, false, true);
    
        promptWindow.onSavePreferences = async (prefs) => {
            const userData = await UserData.load();
            const bounds = promptWindow.getBounds();
            userData.mainPromptWindowPrefs = new PromptWindowPrefs({ ...userData.mainPromptWindowPrefs, ...bounds });
            userData.macros[macroIdx] = prefs;
            await userData.save();
        };
    }
}

export default SetupWindow;
module.exports = SetupWindow;