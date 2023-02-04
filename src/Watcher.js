"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = void 0;
class Watcher {
    constructor(intervalMs, reader, stopCondition) {
        this.reader = reader;
        this.stopCondition = stopCondition;
        this._intervalMs = intervalMs;
        this._intervalPointer = null;
    }
    start() {
        const instance = this;
        this._intervalPointer = this._intervalPointer || setTimeout(() => {
            const output = instance.reader();
            instance._intervalPointer = null;
            if (!instance.stopCondition(output))
                instance.start();
        }, this._intervalMs);
    }
    stop() {
        if (this._intervalPointer)
            clearTimeout(this._intervalPointer);
        this._intervalPointer = null;
    }
}
exports.Watcher = Watcher;
module.exports = Watcher;
exports.default = Watcher;
