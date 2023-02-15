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
const Bounds_1 = require("../Bounds");
const path_1 = __importDefault(require("path"));
class PromptWindow extends electron_1.BrowserWindow {
    constructor(providerFactory, prefs, opts, shouldExecuteOnStartup, isSaveEnabled) {
        const minWidth = 740;
        const minHeight = 500;
        const actualWidth = Math.max(prefs.width || 0, minWidth);
        const actualHeight = Math.max(prefs.height || 0, minHeight);
        super(Object.assign({
            x: prefs.x || undefined,
            y: prefs.y || undefined,
            minWidth: minWidth,
            minHeight: minHeight,
            width: actualWidth,
            height: actualHeight,
            webPreferences: {
                preload: path_1.default.join(__dirname, '../../src/ui-controls/PromptWindowPreload.js'),
                // devTools: !app.isPackaged
            },
            title: 'AI Prompt',
            // resizable: false
        }, opts));
        this.adjustBounds();
        this.prefs = new UserData_1.PromptWindowPrefs(prefs);
        this.providerFactory = providerFactory;
        shouldExecuteOnStartup || (shouldExecuteOnStartup = false);
        this.setMenuBarVisibility(false);
        this.loadFile(path_1.default.join(__dirname, '../../layouts/prompt-window.html'));
        this.on('close', (event) => {
            this.savePreferences();
            if (prefs.hideOnClose) {
                event.preventDefault();
                this.hide();
            }
        });
        this.on('resized', () => {
            const bounds = this.getBounds();
            this.prefs.width = bounds.width;
            this.prefs.height = bounds.height;
        });
        this.on('moved', () => {
            const bounds = this.getBounds();
            this.prefs.x = bounds.x;
            this.prefs.y = bounds.y;
        });
        this.webContents.ipc.handle("prompt:submit-form", (event, data) => __awaiter(this, void 0, void 0, function* () {
            return yield this.submitForm(data);
        }));
        this.webContents.ipc.on('prompt:set-always-on-top', (evt, value) => {
            this.setAlwaysOnTop(value);
        });
        this.webContents.ipc.on('prompt:close', () => {
            this.close();
        });
        this.webContents.ipc.handle('prompt:get-providers', (evt) => __awaiter(this, void 0, void 0, function* () {
            return JSON.stringify(yield providerFactory.getAllProviders());
        }));
        this.webContents.ipc.on('prompt:get-preferences', (evt) => {
            evt.returnValue = JSON.stringify(this.getPreferences());
        });
        this.webContents.ipc.handle('prompt:set-preferences', (evt, prefs) => __awaiter(this, void 0, void 0, function* () {
            this.prefs = new UserData_1.PromptWindowPrefs(Object.assign(Object.assign({}, this.prefs), JSON.parse(prefs)));
            this.setPreferences(this.prefs);
            return JSON.stringify(this.prefs);
        }));
        this.webContents.ipc.handle('prompt:save-preferences', (evt, prefs) => __awaiter(this, void 0, void 0, function* () {
            yield this.savePreferences();
            return null;
        }));
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
            evt.returnValue = isSaveEnabled || false;
        });
    }
    adjustBounds() {
        const bounds = new Bounds_1.Bounds(this.getBounds());
        const display = electron_1.screen.getDisplayMatching(bounds);
        const displayBounds = new Bounds_1.Bounds(display.workArea);
        const intersection = bounds.interseect(displayBounds);
        if (intersection.width == 0 && intersection.height == 0) {
            const newBounds = {
                x: Math.floor((displayBounds.width - bounds.width) / 2),
                y: Math.floor((displayBounds.height - bounds.height) / 2),
                width: bounds.width,
                height: bounds.height
            };
            this.setBounds(newBounds);
        }
    }
    getPreferences() {
        return new UserData_1.PromptWindowPrefs(Object.assign(Object.assign({}, this.prefs), this.getBounds()));
    }
    setPreferences(preferences) {
        this.prefs = preferences;
    }
    savePreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.onSavePreferences && this.onSavePreferences(this.prefs);
            if (result instanceof Promise)
                yield result;
        });
    }
    submitForm(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data || (data = this.prefs);
            const provider = yield this.providerFactory.getProvider(data.providerId);
            const model = provider === null || provider === void 0 ? void 0 : provider.models.filter(m => m.id === data.modelId)[0];
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
