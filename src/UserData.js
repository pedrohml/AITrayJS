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
exports.UserData = exports.PromptWindowPrefs = exports.Bounds = void 0;
const OpenAIProvider_1 = __importDefault(require("./providers/OpenAIProvider"));
const electron_settings_1 = __importDefault(require("electron-settings"));
const electron_1 = require("electron");
class Bounds {
    constructor(obj) {
        obj || (obj = {});
        this.x || (this.x = obj.x);
        this.y || (this.y = obj.y);
        this.width || (this.width = obj.width);
        this.height || (this.height = obj.height);
    }
}
exports.Bounds = Bounds;
class PromptWindowPrefs extends Bounds {
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
        return new Bounds(this);
    }
}
exports.PromptWindowPrefs = PromptWindowPrefs;
class UserData {
    constructor(override) {
        this.mainPromptWindowPrefs = new PromptWindowPrefs(override === null || override === void 0 ? void 0 : override.mainPromptWindowPrefs) || new PromptWindowPrefs();
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
        return __awaiter(this, void 0, void 0, function* () {
            const settingsObject = yield electron_settings_1.default.get('aitray');
            const userData = UserData.fromObject(settingsObject);
            try {
                const encodedAccessKey = Buffer.from(userData.openaiAccessKey, 'base64');
                userData.openaiAccessKey = electron_1.safeStorage.decryptString(encodedAccessKey);
            }
            catch (err) {
                console.error(err);
                userData.openaiAccessKey = '';
            }
            userData.loadProviders();
            return userData;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = new UserData(this); // without providers
            const buffer = electron_1.safeStorage.encryptString(userData.openaiAccessKey);
            const decodedAccessKey = buffer.toString('base64');
            userData.openaiAccessKey = decodedAccessKey;
            yield electron_settings_1.default.set('aitray', JSON.parse(JSON.stringify(userData)));
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
