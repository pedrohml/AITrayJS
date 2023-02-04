import IModel from "./IModel";

export interface IProvider {
    id: string;
    name: string;
    models: IModel[];

    request(model: IModel, prompt: string, context: string | null) : Promise<any>;
}

export default IProvider;