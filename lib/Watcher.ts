import { FuncOut, Predicate, Nullable } from "common";

export class Watcher<T> {
    public reader: FuncOut<T>;
    public stopCondition: Predicate<T>;
    
    private _intervalMs : number;
    private _intervalPointer : Nullable<NodeJS.Timer>;

    constructor(intervalMs: number, reader: FuncOut<T>, stopCondition: Predicate<T>) {
        this.reader = reader;
        this.stopCondition = stopCondition;
        this._intervalMs = intervalMs;
        this._intervalPointer = null;
    }

    public start() {
        const instance = this;
        this._intervalPointer = this._intervalPointer || setTimeout(() => {
            const output = instance.reader();
            instance._intervalPointer = null;
            if (!instance.stopCondition(output))
                instance.start();
        }, this._intervalMs);
    }

    public stop() {
        if (this._intervalPointer)
            clearTimeout(this._intervalPointer);
        this._intervalPointer = null;
    }
}