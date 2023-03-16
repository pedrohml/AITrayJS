export interface IModel {
    id: string;
    name: string;

    request(prompt: string, context: string | null) : Promise<string>;
}