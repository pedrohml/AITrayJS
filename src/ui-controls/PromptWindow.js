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
const path_1 = __importDefault(require("path"));
class PromptWindow extends electron_1.BrowserWindow {
    constructor(providers, prefs, opts, shouldExecuteOnStartup) {
        super(Object.assign({
            // TODO: Issue when change display settings. Window can be lost
            // x: prefs.x,
            // y: prefs.y,
            width: 650,
            height: 400,
            webPreferences: {
                preload: path_1.default.join(__dirname, '../../src/ui-controls/PromptWindowPreload.js')
            },
            title: 'AI Prompt',
            resizable: false
        }, opts));
        this.prefs = prefs;
        this.providers = providers;
        shouldExecuteOnStartup || (shouldExecuteOnStartup = false);
        this.setMenuBarVisibility(false);
        this.loadFile(path_1.default.join(__dirname, '../../src/layouts/prompt-window.html'));
        this.on('close', (event) => {
            if (prefs.hideOnClose) {
                event.preventDefault();
                this.hide();
            }
        });
        this.webContents.ipc.handle("prompt-form-submit", (event, data) => __awaiter(this, void 0, void 0, function* () {
            return yield this.submitForm(data);
        }));
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
    submitForm(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            data || (data = this.prefs);
            const provider = (_a = this.providers) === null || _a === void 0 ? void 0 : _a.filter(p => p.id === data.providerId)[0];
            const model = provider === null || provider === void 0 ? void 0 : provider.models.filter(m => m.id === data.modelId)[0];
            // console.log(this.providers, provider, model);
            if (provider && model) {
                try {
                    return yield provider.request(model, data.prompt, data.context);
                }
                catch (err) {
                    return { error: err };
                }
            }
            else {
                return { error: 'Provider or model can\'t be null' };
            }
        });
    }
}
exports.default = PromptWindow;
module.exports = PromptWindow;
