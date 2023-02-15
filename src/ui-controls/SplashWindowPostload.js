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
            loaded: []
        };
    },
    mounted() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load('user', 400);
            yield this.load('ui', 500);
            yield this.load('ai', 800);
            yield this.load('full', 400);
            setTimeout(() => {
                SplashWindowBridge.closeSplashWindow();
            }, 200);
        });
    },
    updated() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    methods: {
        maskAsLoaded(label) {
            this.$data.loaded.push(label);
        },
        isLoaded(label) {
            return this.$data.loaded.indexOf(label) > -1;
        },
        load(label, timeout) {
            timeout || (timeout = 250);
            return new Promise((res, rej) => {
                setTimeout(() => {
                    this.maskAsLoaded(label);
                    res(true);
                }, timeout);
            });
        }
    }
});
