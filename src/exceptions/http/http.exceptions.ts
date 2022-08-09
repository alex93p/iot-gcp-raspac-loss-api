import { HttpException as NestHttpException } from "@nestjs/common/exceptions/http.exception";
import { ValidationErrorItem } from "joi";

function addKeys(data: Record<string, any>): Record<string, any> {
    return { ...data, keys: Object.keys(data).map(key => key) };
}

export type HttpExceptionError = {
    message: string;
    error_code?: CustomErrorCode; // custom error code
    data?: Record<string, any>;
};

export type HttpResponse = HttpExceptionError & {
    error_code: CustomErrorCode | number;
    data: Record<string, any>;
    useBasicError: boolean;
};

export class HttpException extends NestHttpException {
    constructor(response: HttpExceptionError, statusCode: number, useBasicError = false) {
        const httpResponse: HttpResponse = {
            message: response.message,
            error_code: response.error_code || statusCode,
            data: response.data || {},
            useBasicError: useBasicError,
        };
        super(httpResponse, statusCode);
    }
}

export class BadRequestHttpException extends HttpException {
    constructor(data: ValidationErrorItem) {
        super({ message: data.message, data }, 400);
    }
}

export class UnauthorizedHttpException extends HttpException {
    constructor(message: string) {
        super({ message }, 401, true);
    }
}

export class ForbiddenHttpException extends HttpException {
    constructor(message: string) {
        super({ message }, 403, true);
    }
}

export class NotFoundHttpException extends HttpException {
    constructor(message: string) {
        super({ message }, 404, true);
    }
}

export class ConflictHttpException extends HttpException {
    constructor(message: string, error_code: CustomErrorCode, data: Record<string, any>) {
        data = addKeys(data);
        super({ message, error_code, data }, 409);
    }
}

export class PreconditionFailedHttpException extends HttpException {
    constructor(message: string) {
        super({ message }, 412, true);
    }
}

export class UnprocessableEntityHttpException extends HttpException {
    constructor(message: string, error_code: CustomErrorCode, data: Record<string, any>) {
        data = addKeys(data);
        super({ message, error_code, data }, 422);
    }
}

export enum CustomErrorCode {}
