import { IProvider } from "providers/IProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { KiranProvider } from "./providers/KiranProvider";
import { Rectangle, safeStorage } from "electron";
import { Bounds } from "./Bounds";
import settings from 'electron-settings';

export class PromptWindowPrefs {
    public providerId: string;
    public modelId: string;
    public prompt: string;
    public context: string;
    public result: string;
    public clipboardAutoMode: boolean;
    public isAlwaysOnTop: boolean;
    public hideOnClose: boolean;
    public bounds: Bounds;

    constructor(obj?: any) {
        obj ||= {};
        this.providerId = obj.providerId || "";
        this.modelId = obj.modelId || "";
        this.prompt = obj.prompt || "";
        this.context = obj.context || "";
        this.result = obj.result || "";
        this.clipboardAutoMode = obj.clipboardAutoMode || false;
        this.isAlwaysOnTop = obj.isAlwaysOnTop || false;
        this.hideOnClose = obj.hideOnClose || false;
        this.bounds = new Bounds(obj.bounds || {});
    }

    public getBounds(): Bounds {
        return this.bounds;
    }

    public setBounds(bounds: Bounds | Rectangle) {
        this.bounds.x = bounds.x;
        this.bounds.y = bounds.y;
        this.bounds.width = bounds.width;
        this.bounds.height = bounds.height;
    }
}

export class UserData {
    public mainPromptWindowPrefs: PromptWindowPrefs;
    public providers?: IProvider[];
    public openaiAccessKey: string;
    public kiranAccessKey: string;
    public macros: PromptWindowPrefs[];

    constructor(override?: UserData) {
        this.mainPromptWindowPrefs = new PromptWindowPrefs(override?.mainPromptWindowPrefs || {});
        this.openaiAccessKey = override?.openaiAccessKey || '';
        this.kiranAccessKey = override?.kiranAccessKey || '';
        this.macros = (override?.macros || [
                {}, {}, {}
            ])
            .map(m => new PromptWindowPrefs({...new PromptWindowPrefs(), ...m}));
    }
    
    public static fromObject(obj: any) : UserData {
        return new UserData(obj as UserData);
    }

    public static async load() : Promise<UserData> {
        const userDataJson = (await settings.get('aitray'))?.toString() || '';
        let userData = null;
        if (userDataJson) {
            try {
                const userDataBuffer = Buffer.from(userDataJson, 'base64');
                const userDataDecrypted = safeStorage.decryptString(userDataBuffer);
                userData = UserData.fromObject(JSON.parse(userDataDecrypted));
            } catch (err) {
                userData = new UserData();
                console.error(`Failed to read user data [File=${settings.file()}, Message=${err}]`);
            }
            userData.loadProviders();
        }
        return userData || new UserData();
    }

    public async save() : Promise<void> {
        const userData = new UserData(this); // without providers
        const userDataEncrypted = safeStorage.encryptString(JSON.stringify(userData));
        const userDataEncoded = userDataEncrypted.toString('base64');
        try {
            await settings.set('aitray', userDataEncoded);
        } catch (err) {
            console.error(`Failed to write user data [File=${settings.file()}, Message=${err}]`);
        }
    }

    private loadProviders() : void {
        this.providers = [
            new OpenAIProvider(this.openaiAccessKey),
            new KiranProvider(this.kiranAccessKey),
        ];
    }
}