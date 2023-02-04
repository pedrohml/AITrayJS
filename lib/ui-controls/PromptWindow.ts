import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { PromptWindowPrefs } from "UserData";
import path from "path";
import IProvider from "providers/IProvider";

class PromptWindow extends BrowserWindow {
    private providers?: IProvider[];
    private prefs: PromptWindowPrefs;
    public onSavePreferences?: (prefs: PromptWindowPrefs) => void | Promise<void>;

    constructor(providers: IProvider[], prefs: PromptWindowPrefs, opts: BrowserWindowConstructorOptions, shouldExecuteOnStartup?: boolean) {
        super(Object.assign({
            // TODO: Issue when change display settings. Window can be lost
            // x: prefs.x,
            // y: prefs.y,
            width: 650,
            height: 400,
            webPreferences: {
                preload: path.join(__dirname, '../../src/ui-controls/PromptWindowPreload.js')
            },
            title: 'AI Prompt',
            resizable: false
        }, opts));

        this.prefs = prefs;
        this.providers = providers;

        shouldExecuteOnStartup ||= false;

        this.setMenuBarVisibility(false);

        this.loadFile(path.join(__dirname, '../../src/layouts/prompt-window.html'));

        this.on('close', (event) => {
            if (prefs.hideOnClose) {
                event.preventDefault();
                this.hide();
            }
        });

        this.webContents.ipc.handle("prompt-form-submit", async (event, data) => {
            return await this.submitForm(data);
        });

        this.webContents.ipc.on('set-always-on-top', (evt, value) => {
            this.setAlwaysOnTop(value);
        });

        this.webContents.ipc.on('close-prompt-window', () => {
            this.close();
        });

        this.webContents.ipc.on('get-providers', (evt) => {
            evt.returnValue = JSON.stringify(providers);
        });

        this.webContents.ipc.on('get-preferences', (evt) => {
            evt.returnValue = JSON.stringify(this.prefs || {});
        });

        this.webContents.ipc.on('set-preferences', (evt, prefs) => {
            this.prefs = JSON.parse(prefs);
            this.onSavePreferences && this.onSavePreferences(this.prefs);
        });

        this.webContents.ipc.on('should-execute-on-startup', (evt) => {
            evt.returnValue = shouldExecuteOnStartup;
        });
    }

    private async submitForm(data?: any) : Promise<void | any> {
        data ||= this.prefs;
        const provider = this.providers?.filter(p => p.id === data.providerId)[0];
        const model = provider?.models.filter(m => m.id === data.modelId)[0];
        // console.log(this.providers, provider, model);
        if (provider && model) {
            try {
                return await provider.request(model, data.prompt, data.context);
            } catch (err) {
                return { error: err };
            }
        } else {
            return { error: 'Provider or model can\'t be null' };
        }
    }
}

export default PromptWindow;
module.exports = PromptWindow;