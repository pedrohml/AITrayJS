import { IModel } from "./IModel";
import { RequestError } from "./RequestError";
import { CreateCompletionRequest, OpenAIApi } from "openai";

export class OpenAITextModel implements IModel {
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

    private buildRequestContext(prompt: string, context: string | null): CreateCompletionRequest {
        let enhancedPrompt = prompt;
        if (context)
            enhancedPrompt =
                `Context:${context}\n` +
                `Prompt:${prompt}\n` +
                `Answer:`;
        return {
            model: this.id,
            prompt: enhancedPrompt,
            temperature: 0.5,
            max_tokens: 500,
            top_p: 0.1,
            frequency_penalty: 1,
            presence_penalty: 1
        } as CreateCompletionRequest;
    }

    private processResponse(response: any) : string {
        if (response.status == 200) {
            return response.data.choices[0].text.trim();
        } else {
            throw new RequestError(`Failed to request OpenAI text completion [StatusCode=${response.status}, Message=${response.data}]`);
        }
    }

    async request(prompt: string, context: string | null) : Promise<string> {
        const payload = this.buildRequestContext(prompt, context);
        const response = await this.client.createCompletion(payload, { timeout: this.timeout });
        return this.processResponse(response);
    }
}