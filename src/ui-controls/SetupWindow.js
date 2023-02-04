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
const electron_1 = require("electron");
const UserData_1 = require("../UserData");
const electron_settings_1 = __importDefault(require("electron-settings"));
const path_1 = __importDefault(require("path"));
const PromptWindow_1 = __importDefault(require("./PromptWindow"));
class SetupWindow extends electron_1.BrowserWindow {
    constructor(userData) {
        super({
            width: 650,
            height: 250,
            webPreferences: {
                preload: path_1.default.join(__dirname, '../../src/ui-controls/SetupWindowPreload.js'),
            },
            resizable: false
        });
        this.userData = userData;
        this.setMenuBarVisibility(false);
        this.loadFile(path_1.default.join(__dirname, '../../src/layouts/setup-window.html'));
        this.webContents.ipc.handle('setup-form-submit', (evt, userData) => __awaiter(this, void 0, void 0, function* () { return yield this.submitForm(userData); }));
        this.webContents.ipc.on('close-setup-window', (evt) => this.close());
        this.webContents.ipc.on('open-macro', (evt, macroIdx) => {
            this.configMacro(macroIdx);
        });
    }
    submitForm(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield electron_settings_1.default.set('aitray', JSON.parse(JSON.stringify(userData)));
        });
    }
    configMacro(macroIdx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield UserData_1.UserData.load();
            const promptWindow = new PromptWindow_1.default(userData.providers, new UserData_1.PromptWindowPrefs(Object.assign(Object.assign({}, userData.macros[macroIdx]), userData.mainPromptWindowPrefs.getBounds())), { show: true, modal: true, parent: this, title: `AI Prompt (Macro ${macroIdx})` });
            promptWindow.onSavePreferences = (prefs) => __awaiter(this, void 0, void 0, function* () {
                const userData = yield UserData_1.UserData.load();
                const bounds = promptWindow.getBounds();
                userData.mainPromptWindowPrefs = new UserData_1.PromptWindowPrefs(Object.assign(Object.assign({}, userData.mainPromptWindowPrefs), bounds));
                userData.macros[macroIdx] = prefs;
                yield userData.save();
            });
        });
    }
}
exports.default = SetupWindow;
module.exports = SetupWindow;
