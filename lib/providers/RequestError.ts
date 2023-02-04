class RequestError extends Error {
    name: string = typeof(RequestError);

    constructor(message: string) {
        super(message);
    }
}

export default RequestError;