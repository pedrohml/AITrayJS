"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("./RequestError"));
const RequestContext_1 = __importDefault(require("./RequestContext"));
class OpenAIModel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    buildRequestContext(prompt, context) {
        let enhancedPrompt = prompt;
        if (context)
            enhancedPrompt =
                `Context:${context}\n` +
                    `Prompt:${prompt}\n` +
                    `Answer:`;
        return new RequestContext_1.default({
            model: this.id,
            prompt: enhancedPrompt,
            temperature: 0.5,
            max_tokens: 250,
            top_p: 0.1,
            frequency_penalty: 1,
            presence_penalty: 1
        });
    }
    processResponse(response) {
        if (response.status == 200) {
            return response.data.choices[0].text.trim();
        }
        else {
            throw new RequestError_1.default(`Failed to request OpenAI text completion [StatusCode=${response.status}, Message=${response.data}]`);
        }
    }
}
exports.default = OpenAIModel;
module.exports = OpenAIModel;
