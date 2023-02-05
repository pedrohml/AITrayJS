"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = exports.PromptWindowPrefs = void 0;
const OpenAIProvider_1 = __importDefault(require("./providers/OpenAIProvider"));
const electron_settings_1 = __importDefault(require("electron-settings"));
const electron_1 = require("electron");
const Bounds_1 = require("./Bounds");
class PromptWindowPrefs extends Bounds_1.Bounds {
    constructor(obj) {
        obj || (obj = {});
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
    getBounds() {
        return new Bounds_1.Bounds(this);
    }
}
exports.PromptWindowPrefs = PromptWindowPrefs;
class UserData {
    constructor(override) {
        this.mainPromptWindowPrefs = new PromptWindowPrefs((override === null || override === void 0 ? void 0 : override.mainPromptWindowPrefs) || {});
        this.openaiAccessKey = (override === null || override === void 0 ? void 0 : override.openaiAccessKey) || '';
        this.macros = (override === null || override === void 0 ? void 0 : override.macros) || [
            {}, {}, {}
        ]
            .map(m => (Object.assign(Object.assign({}, new PromptWindowPrefs()), m)));
    }
    static fromObject(obj) {
        return new UserData(obj);
    }
    static load() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userDataJson = ((_a = (yield electron_settings_1.default.get('aitray'))) === null || _a === void 0 ? void 0 : _a.toString()) || '';
            let userData = null;
            if (userDataJson) {
                try {
                    const userDataBuffer = Buffer.from(userDataJson, 'base64');
                    const userDataDecrypted = electron_1.safeStorage.decryptString(userDataBuffer);
                    userData = UserData.fromObject(JSON.parse(userDataDecrypted));
                }
                catch (err) {
                    userData = new UserData();
                    console.error(`Failed to read user data [File=${electron_settings_1.default.file()}, Message=${err}]`);
                }
                userData.loadProviders();
            }
            return userData || new UserData();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = new UserData(this); // without providers
            const userDataEncrypted = electron_1.safeStorage.encryptString(JSON.stringify(userData));
            const userDataEncoded = userDataEncrypted.toString('base64');
            try {
                yield electron_settings_1.default.set('aitray', userDataEncoded);
            }
            catch (err) {
                console.error(`Failed to write user data [File=${electron_settings_1.default.file()}, Message=${err}]`);
            }
        });
    }
    loadProviders() {
        this.providers = [
            new OpenAIProvider_1.default(this.openaiAccessKey)
        ];
    }
}
exports.UserData = UserData;
exports.default = { UserData, PromptWindowPrefs };
module.exports = { UserData, PromptWindowPrefs };
