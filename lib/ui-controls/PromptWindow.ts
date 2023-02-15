import { BrowserWindowConstructorOptions, app, screen } from "electron";
import { PromptWindowPrefs } from "../UserData";
import { Bounds } from "../Bounds";
import { ProviderFactory } from "providers/ProviderFactory";
import { BaseWindow } from "./BaseWindow";
import path from "path";

export class PromptWindow extends BaseWindow {
    private providerFactory: ProviderFactory;
    private prefs: PromptWindowPrefs;
    public onSavePreferences?: (prefs: PromptWindowPrefs) => void | Promise<void>;

    constructor(providerFactory: ProviderFactory, prefs: PromptWindowPrefs, opts: BrowserWindowConstructorOptions, shouldExecuteOnStartup?: boolean) {
        const minWidth = 740;
        const minHeight = 500;
        const actualWidth = Math.max(prefs.bounds?.width || 0, minWidth);
        const actualHeight = Math.max(prefs.bounds?.height || 0, minHeight);

        super({
            ...{
                x: prefs.bounds?.x || undefined,
                y: prefs.bounds?.y || undefined,
                minWidth: minWidth,
                minHeight: minHeight,
                width: actualWidth,
                height: actualHeight,
                webPreferences: {
                    preload: path.join(__dirname, './PromptWindowPreload.js'),
                    devTools: !app.isPackaged
                },
                title: 'AI Prompt',
            },
            ...opts
            },
            prefs.hideOnClose);

        this.adjustBounds();

        this.prefs = new PromptWindowPrefs(prefs);
        this.providerFactory = providerFactory;

        shouldExecuteOnStartup ||= false;

        this.setMenuBarVisibility(false);

        this.loadFile(path.join(__dirname, '../../layouts/prompt-window.html'));

        this.on('close', (event) => {
            this.savePreferences();
        });

        this.on('resized', () => {
            this.prefs.setBounds(this.getBounds());
        });

        this.on('moved', () => {
            this.prefs.setBounds(this.getBounds());
        });

        this.webContents.ipc.handle("prompt:submit-form", async (event, data) => {
            return await this.submitForm(data);
        });

        this.webContents.ipc.on('prompt:set-always-on-top', (evt, value) => {
            this.setAlwaysOnTop(value);
        });

        this.webContents.ipc.on('prompt:close', () => {
            this.close();
        });

        this.webContents.ipc.handle('prompt:get-providers', async (evt) => {
            return JSON.stringify(await providerFactory.getAllProviders());
        });

        this.webContents.ipc.on('prompt:get-preferences', (evt) => {
            evt.returnValue = JSON.stringify(this.getPreferences());
        });

        this.webContents.ipc.handle('prompt:set-preferences', async (evt, prefs) => {
            this.prefs = new PromptWindowPrefs({...this.prefs, ...JSON.parse(prefs)});
            this.setPreferences(this.prefs);
            return JSON.stringify(this.prefs);
        });

        this.webContents.ipc.handle('prompt:save-preferences', async (evt, prefs) => {
            await this.savePreferences();
            return null;
        });

        this.webContents.ipc.on('prompt:should-execute-on-startup', (evt) => {
            evt.returnValue = shouldExecuteOnStartup;
        });

        this.webContents.ipc.on('prompt:is-visible', (evt) => {
            evt.returnValue = this.isVisible();
        });

        this.webContents.ipc.on('prompt:focus', (evt) => {
            this.focus();
        });

        this.webContents.ipc.on('prompt:is-save-enabled', (evt) => {
            evt.returnValue = false;
        });
    }

    private adjustBounds() {
        const bounds = new Bounds(this.getBounds());
        const display = screen.getDisplayMatching(bounds);
        const displayBounds = new Bounds(display.workArea);
        const intersection = bounds.interseect(displayBounds);

        if (intersection.width == 0 && intersection.height == 0) {
            const newBounds = {
                x: Math.floor((displayBounds.width - bounds.width) / 2),
                y: Math.floor((displayBounds.height - bounds.height) / 2),
                width: bounds.width,
                height: bounds.height
            };
            this.setBounds(newBounds);
            this.prefs.setBounds(newBounds);
        }
    }

    public getPreferences() : PromptWindowPrefs {
        return new PromptWindowPrefs({...this.prefs, ...this.getBounds()});
    }

    public setPreferences(preferences: PromptWindowPrefs) {
        this.prefs = preferences;
    }

    public async savePreferences() {
        const result = this.onSavePreferences && this.onSavePreferences(this.prefs);
        if (result instanceof Promise)
            await result;
    }

    private async submitForm(data?: any) : Promise<void | any> {
        data ||= this.prefs;
        const provider = await this.providerFactory.getProvider(data.providerId);
        const model = provider?.models.filter(m => m.id === data.modelId)[0];
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