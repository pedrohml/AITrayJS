import RequestContext from "./RequestContext";

interface IModel {
    id: string;
    name: string;

    buildRequestContext(prompt: string, context: string | null) : RequestContext;
    processResponse(response: any): string;
}

export default IModel;