"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = require("openai");
const OpenAIModel_1 = __importDefault(require("./OpenAIModel"));
class OpenAIProvider {
    constructor(accessKey) {
        this.id = 'openai';
        this.name = 'OpenAI';
        this.models = [
            { id: 'text-davinci-003', name: 'Text Davinci' },
            { id: 'text-curie-001', name: 'Text Curie' },
            { id: 'text-babbage-001', name: 'Text Babbage' },
            { id: 'text-ada-001', name: 'Text Ada' }
        ].map(m => new OpenAIModel_1.default(m.id, m.name));
        this.client = new openai_1.OpenAIApi(new openai_1.Configuration({ apiKey: accessKey }));
    }
    request(model, prompt, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestContext = model.buildRequestContext(prompt, context);
            const response = yield this.client.createCompletion(requestContext.payload);
            return model.processResponse(response);
        });
    }
}
exports.OpenAIProvider = OpenAIProvider;
exports.default = OpenAIProvider;
module.exports = OpenAIProvider;
