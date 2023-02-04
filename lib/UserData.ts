import IProvider from "providers/IProvider";
import OpenAIProvider from "./providers/OpenAIProvider";
import settings from 'electron-settings';
import { safeStorage } from "electron";

export class PromptWindowPrefs {
    public x: number | null;
    public y: number | null;
    public providerId: string;
    public modelId: string;
    public prompt: string;
    public context: string;
    public result: string;
    public clipboardAutoMode: boolean;
    public isAlwaysOnTop: boolean;
    public hideOnClose: boolean;

    constructor() {
        this.x = null;
        this.y = null;
        this.providerId = "";
        this.modelId = "";
        this.prompt = "";
        this.context = "";
        this.result = "";
        this.clipboardAutoMode = false;
        this.isAlwaysOnTop = false;
        this.hideOnClose = false;
    }
}

export class UserData {
    public mainPromptWindowPrefs: PromptWindowPrefs;
    public providers?: IProvider[];
    public openaiAccessKey: string;
    public macros: PromptWindowPrefs[];

    constructor(override?: UserData) {
        this.mainPromptWindowPrefs = override?.mainPromptWindowPrefs || new PromptWindowPrefs();
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