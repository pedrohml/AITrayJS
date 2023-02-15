import { OpenAIApi, Configuration, CreateCompletionRequest } from "openai";
import { IProvider } from "./IProvider";
import { IModel } from "./IModel";
import { OpenAIModel } from "./OpenAIModel";

export class OpenAIProvider implements IProvider {
    public id: string;
    public name: string;
    public models: IModel[];
    public client: OpenAIApi;
    
    constructor(accessKey: string) {
        this.id = 'openai';
        this.name = 'OpenAI';
        this.models = [
            { id: 'text-davinci-003', name: 'Text Davinci' },
            { id: 'text-curie-001', name: 'Text Curie' },
            { id: 'text-babbage-001', name: 'Text Babbage' },
            { id: 'text-ada-001', name: 'Text Ada' },
            { id: 'code-davinci-002', name: 'Code Davinci' },
            { id: 'code-cushman-001', name: 'Code Cushman' },
        ].map(m => new OpenAIModel(m.id, m.name));
        this.client = new OpenAIApi(new Configuration({apiKey: accessKey }));
    }

    public async request(model: IModel, prompt: string, context: string | null) : Promise<string> {
        const requestContext = model.buildRequestContext(prompt, context);
        try {
            const response = await this.client.createCompletion(requestContext.payload as CreateCompletionRequest, { timeout: 30000 });
            return model.processResponse(response);
        } catch (err) {
            return `ERROR [Message=${err}]`;
        }
    }
}