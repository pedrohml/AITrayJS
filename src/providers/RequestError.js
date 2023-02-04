"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestError extends Error {
    constructor(message) {
        super(message);
        this.name = typeof (RequestError);
    }
}
exports.default = RequestError;
