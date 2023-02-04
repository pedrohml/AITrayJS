import IProvider from "providers/IProvider";
import OpenAIProvider from "./providers/OpenAIProvider";
import settings from 'electron-settings';
import { safeStorage } from "electron";
import { Bounds } from "./Bounds";

export class PromptWindowPrefs extends Bounds {
    public providerId: string;
    public modelId: string;
    public prompt: string;
    public context: string;
    public result: string;
    public clipboardAutoMode: boolean;
    public isAlwaysOnTop: boolean;
    public hideOnClose: boolean;

    constructor(obj?: any) {
        obj ||= {};
        super(obj);
        this.providerId = obj.providerId || "";
        this.modelId = obj.modelId || "";
        this.prompt = obj.prompt || "";
        this.context = obj.context || "";
        this.result = obj.result || "";
        this.clipboardAutoMode = obj.clipboardAutoMode || false;
        this.isAlwaysOnTop = obj.isAlwaysOnTop || false;
        this.hideOnClose = obj.hideOnClose || false;
    }

    public getBounds(): Bounds {
        return new Bounds(this);
    }
}

export class UserData {
    public mainPromptWindowPrefs: PromptWindowPrefs;
    public providers?: IProvider[];
    public openaiAccessKey: string;
    public macros: PromptWindowPrefs[];

    constructor(override?: UserData) {
        this.mainPromptWindowPrefs = new PromptWindowPrefs(override?.mainPromptWindowPrefs || {});
        this.openaiAccessKey = override?.openaiAccessKey || '';
        this.macros = override?.macros || [
                {}, {}, {}
            ]
            .map(m => ({...new PromptWindowPrefs(), ...m}) as PromptWindowPrefs);
    }
    
    public static fromObject(obj: any) : UserData {
        return new UserData(obj as UserData);
    }

    public static async load() : Promise<UserData> {
        const settingsObject = await settings.get('aitray') as object;
        const userData = UserData.fromObject(settingsObject);
        try {
            const encodedAccessKey = Buffer.from(userData.openaiAccessKey, 'base64');
            userData.openaiAccessKey = safeStorage.decryptString(encodedAccessKey);
        } catch (err) {
            console.error(err);
            userData.openaiAccessKey = '';
        }
        userData.loadProviders();
        return userData;
    }

    public async save() : Promise<void> {
        const userData = new UserData(this); // without providers
        const buffer = safeStorage.encryptString(userData.openaiAccessKey);
        const decodedAccessKey = buffer.toString('base64');
        userData.openaiAccessKey = decodedAccessKey;
        await settings.set('aitray', JSON.parse(JSON.stringify(userData)));
    }

    private loadProviders() : void{
        this.providers = [
            new OpenAIProvider(this.openaiAccessKey)
        ];
    }

}

export default { UserData, PromptWindowPrefs };
module.exports = { UserData, PromptWindowPrefs };