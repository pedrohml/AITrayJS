import { IModel } from "./IModel";
import { RequestError } from "./RequestError";
import { CreateChatCompletionRequest, OpenAIApi } from "openai";

export class OpenAIChatModel implements IModel {
    id: string;
    name: string;
    client: OpenAIApi;
    timeout: number;

    constructor(client: OpenAIApi, id: string, name: string, timeout?: number) {
        this.id = id;
        this.name = name;
        this.client = client;
        this.timeout = timeout || 30000;
    }

    private buildRequestContext(prompt: string, context: string | null): CreateChatCompletionRequest {
        return {
            model: this.id,
            messages: [
                {"role": "system", "content": `As a helpful assistant, your role is to give the most straight forward answer to: ${prompt}`},
                {"role": "user", "content": context}],
            temperature: 0.3,
            max_tokens: 250,
            top_p: 0.1,
            frequency_penalty: 1,
            presence_penalty: 1
        } as CreateChatCompletionRequest;
    }

    private processResponse(response: any) : string {
        if (response.status == 200) {
            return response.data.choices[0].message.content.trim();
        } else {
            throw new RequestError(`Failed to request OpenAI chat completion [StatusCode=${response.status}, Message=${response.data}]`);
        }
    }

    async request(prompt: string, context: string | null) : Promise<string> {
        const payload = this.buildRequestContext(prompt, context);
        const response = await this.client.createChatCompletion(payload, { timeout: this.timeout });
        return this.processResponse(response);
    }
}