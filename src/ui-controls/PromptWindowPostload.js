"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vueApp = new Vue({
    el: '#app',
    data() {
        const preferences = this.getPreferences();
        PromptWindowBridge.setAlwaysOnTop(preferences.isAlwaysOnTop);
        return Object.assign({
            providers: undefined,
            providerId: 'openai',
            modelId: 'text-davinci-003',
            context: preferences.clipboardAutoMode ? this.readFromClipboard() : '',
            prompt: '',
            result: '',
            clipboardAutoMode: preferences.clipboardAutoMode,
            isAlwaysOnTop: preferences.isAlwaysOnTop,
            isSaveEnabled: PromptWindowBridge.isSaveEnabled(),
        }, preferences);
    },
    mounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this;
            const providers = yield PromptWindowBridge.getProviders();
            const providersMap = Object.fromEntries(providers.map(p => [p.id, p]));
            this.providers = providersMap;
            this.clipboardWatcher = this.clipboardWatcher || new Watcher(250, () => {
                if (app.clipboardAutoMode) {
                    app.context = this.readFromClipboard();
                    if (PromptWindowBridge.isWindowVisible() && app.context !== this.previousClipboard) {
                        PromptWindowBridge.focusWindow();
                        this.$refs.prompt.focus();
                    }
                    this.previousClipboard = this.context;
                }
            }, () => false);
            this.clipboardWatcher.start();
            document.addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === 'Enter')
                    app.submitForm();
                else if (event.key === 'Escape')
                    this.closeWindow();
            });
            if (PromptWindowBridge.shouldExecuteOnStartup())
                this.submitForm();
        });
    },
    updated() {
        return __awaiter(this, void 0, void 0, function* () {
            PromptWindowBridge.setAlwaysOnTop(!!this.isAlwaysOnTop);
            yield this.setPreferences();
        });
    },
    methods: {
        submitForm() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.prompt) {
                    this.$refs.loadingOverlay.removeAttribute("hidden");
                    this.$refs.form.setAttribute("disabled", true);
                    try {
                        const currentData = JSON.parse(JSON.stringify(this.$data));
                        this.result = yield PromptWindowBridge.submitForm(currentData);
                        currentData.result = this.result;
                        yield this.savePreferences(currentData);
                    }
                    catch (err) {
                        this.result = err.message;
                    }
                    this.$refs.form.setAttribute("disabled", false);
                    this.$refs.loadingOverlay.setAttribute("hidden", true);
                }
            });
        },
        savePreferences(data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield PromptWindowBridge.setPreferences(data);
                yield PromptWindowBridge.savePreferences(data);
            });
        },
        setPreferences(data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield PromptWindowBridge.setPreferences(data || JSON.parse(JSON.stringify(this.$data)));
            });
        },
        readFromClipboard() {
            return (PromptWindowBridge.readFromClipboard() || '').trim();
        },
        getPreferences() {
            const preferences = PromptWindowBridge.getPreferences();
            const clipboardAutoMode = preferences.clipboardAutoMode || false;
            if (clipboardAutoMode) {
                delete preferences.context;
                delete preferences.result;
            }
            if (!preferences.providerId) {
                delete preferences.providerId;
                delete preferences.modelId;
            }
            else if (!preferences.modelId) {
                delete preferences.modelId;
            }
            return preferences;
        },
        clearForm() {
            this.context = this.clipboardAutoMode ? this.context : '';
            this.prompt = '';
            this.result = '';
        },
        closeWindow() {
            PromptWindowBridge.closePromptWindow();
        },
        clipboardChanged() {
            if (this.clipboardAutoMode)
                this.context = this.readFromClipboard();
            else
                this.context = '';
        },
        contextChanged() {
        },
        comparePrefs(prevPrefs, newPrefs) {
            if (this.clipboardAutoMode) {
                prevPrefs = Object.assign(Object.assign({}, prevPrefs), { context: null });
                newPrefs = Object.assign(Object.assign({}, newPrefs), { context: null });
            }
            prevPrefs = JSON.stringify(prevPrefs);
            newPrefs = JSON.stringify(newPrefs);
            return prevPrefs === newPrefs;
        }
    }
});
