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
class PromptWindowPrefs {
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
exports.PromptWindowPrefs = PromptWindowPrefs;
class UserData {
    constructor(override) {
        this.mainPromptWindowPrefs = (override === null || override === void 0 ? void 0 : override.mainPromptWindowPrefs) || new PromptWindowPrefs();
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
                userData.openaiAccessKey = electron_1.safeStorage.decryptString(new Buffer(userData.openaiAccessKey, 'base64'));
            }
            catch (err) {
                console.error(err);
                userData.openaiAccessKey = '';
            }
            finally {
                // TODO: catch errors
                userData.openaiAccessKey = '';
            }
            userData.loadProviders();
            return userData;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = new UserData(this); // without providers
            userData.openaiAccessKey = electron_1.safeStorage.encryptString(userData.openaiAccessKey).toString('base64');
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
