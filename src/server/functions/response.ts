enum ResponseType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning"
}

interface ResponsePayload {
    type?: ResponseType;
    message?: string;
    token?: string;
    data?: any;
    meta?: any;
    [key: string]: any;
}

const createResponse = (type: ResponseType, message?: string, token?: string, data?: any, meta?: any, additionalParams?: object): ResponsePayload => {
    const payload: ResponsePayload = { type };

    if (message) {
        payload.message = message;
    }

    if (token) {
        payload.token = token;
    }

    if (data) {
        payload.data = data;
    }

    if (meta) {
        payload.meta = meta;
    }

    if (additionalParams) {
        Object.assign(payload, additionalParams);
    }

    return payload;
};

// Funciones de ayuda
const successResponse = ({ message, token, data, meta, additionalParams }: ResponsePayload): ResponsePayload => {
    return createResponse(ResponseType.SUCCESS, message, token, data, meta, additionalParams);
};

const errorResponse = ({ message, token, data, meta, additionalParams }: ResponsePayload): ResponsePayload => {
    return createResponse(ResponseType.ERROR, message, token, data, meta, additionalParams);
};

const warningResponse = ({ message, token, data, meta, additionalParams }: ResponsePayload): ResponsePayload => {
    return createResponse(ResponseType.WARNING, message, token, data, meta, additionalParams);
};

export { ResponseType, createResponse, successResponse, errorResponse, warningResponse };