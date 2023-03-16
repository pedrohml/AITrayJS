import { OpenAIApi, Configuration, CreateCompletionRequest, CreateChatCompletionRequest } from "openai";
import { IProvider } from "./IProvider";
import { IModel } from "./IModel";
import { OpenAITextModel } from "./OpenAITextModel";
import { OpenAIChatModel } from "./OpenAIChatModel";

export class OpenAIProvider implements IProvider {
    public id: string;
    public name: string;
    public models: IModel[];
    public client: OpenAIApi;
    
    constructor(accessKey: string) {
        this.id = 'openai';
        this.name = 'OpenAI';
        this.client = new OpenAIApi(new Configuration({apiKey: accessKey }));
        this.models = [
            { id: 'gpt-4', name: 'GPT 4', type: 'chat' },
            { id: 'gpt-3.5-turbo', name: 'GPT 3.5', type: 'chat' },

            { id: 'text-davinci-003', name: 'Text Davinci', type: 'text' },
            { id: 'text-curie-001', name: 'Text Curie', type: 'text' },
            { id: 'text-babbage-001', name: 'Text Babbage', type: 'text' },
            { id: 'text-ada-001', name: 'Text Ada', type: 'text' },
            { id: 'code-davinci-002', name: 'Code Davinci', type: 'text' },
            { id: 'code-cushman-001', name: 'Code Cushman', type: 'text' },
        ].map(m => m.type === 'text' ? new OpenAITextModel(this.client, m.id, m.name) : new OpenAIChatModel(this.client, m.id, m.name));
    }

    public async request(model: IModel, prompt: string, context: string | null) : Promise<string> {
        try {
            return await model.request(prompt, context);
        } catch (err) {
            return `Failed when prompting [Message=${err}]`;
        }
    }
}