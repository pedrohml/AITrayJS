import IProvider from "./IProvider";
import IModel from "./IModel";
import KiranModel from "./KiranModel";
import axios from "axios";

export class KiranProvider implements IProvider {
    public id: string;
    public name: string;
    public models: IModel[];
    public accessKey: string;
    
    constructor(accessKey: string) {
        this.id = 'kiran';
        this.name = 'Kiran';
        this.models = [
            { id: 'text-chat-davinci-002', name: 'ChatGPT' },
            { id: 'text-davinci-003', name: 'Text Davinci' },
        ].map(m => new KiranModel(m.id, m.name));
        this.accessKey = accessKey;
    }

    public async request(model: IModel, prompt: string, context: string | null) : Promise<string> {
        const requestContext = model.buildRequestContext(prompt, context);
        try {
            console.log('request: ', JSON.stringify(requestContext));
            const response = await axios.post(`https://fhl-kirmadi01.westus2.cloudapp.azure.com/api/gpt?model=${model.id}`,
                requestContext.payload,
                {
                    headers: {
                        'X-Token': this.accessKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 30000
                });
            console.log('reponse: ', response);
            return model.processResponse(response);
        } catch (err) {
            return `ERROR [Message=${err}]`;
        }
    }
}