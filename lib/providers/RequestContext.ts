export class RequestContext {
    payload: object | null = null;

    constructor(payload: object) {
        this.payload = payload;
    }
}