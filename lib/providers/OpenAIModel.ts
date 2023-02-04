import IModel from "./IModel";
import RequestError from "./RequestError";
import RequestContext from "./RequestContext";

class OpenAIModel implements IModel {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    buildRequestContext(prompt: string, context: string | null): RequestContext {
        let enhancedPrompt = prompt;
        if (context)
            enhancedPrompt =
                `Context:${context}\n` +
                `Prompt:${prompt}\n` +
                `Answer:`;
        return new RequestContext({
            model: this.id,
            prompt: enhancedPrompt,
            temperature: 0.5,
            max_tokens: 250,
            top_p: 0.1,
            frequency_penalty: 1,
            presence_penalty: 1
        });
    }

    processResponse(response: any) : string {
        if (response.status == 200) {
            return response.data.choices[0].text.trim();
        } else {
            throw new RequestError(`Failed to request OpenAI text completion [StatusCode=${response.status}, Message=${response.data}]`);
        }
    }
}

export default OpenAIModel;
module.exports = OpenAIModel;