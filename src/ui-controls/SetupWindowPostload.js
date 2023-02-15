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
        return {
            openaiAccessKey: '',
            macros: [],
        };
    },
    mounted() {
        return __awaiter(this, void 0, void 0, function* () {
            document.addEventListener('keydown', (evt) => {
                if (evt.key === 'Escape')
                    SetupWindowBridge.closeSetupWindow();
            });
            const userData = yield SetupWindowBridge.readUserData();
            this.openaiAccessKey = userData.openaiAccessKey;
            this.macros = userData.macros;
        });
    },
    updated() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield SetupWindowBridge.readUserData();
            userData.openaiAccessKey = this.openaiAccessKey;
            userData.macros = this.macros;
            yield SetupWindowBridge.writeUserData(userData);
        });
    },
    methods: {
        openMacro(idx) {
            SetupWindowBridge.openMacro(idx);
        }
    }
});
