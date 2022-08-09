import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { HttpException, HttpResponse, HttpExceptionError } from "../../exceptions/http/http.exceptions";

type ErrorPayload = {
    code: number; // http status code
    message: string;
    error?: HttpExceptionError & {
        code: number;
        data: Record<string, any>;
    };
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const { error_code, data, useBasicError, message } = exception.getResponse() as HttpResponse;

        const payload: ErrorPayload = {
            code: status,
            message: message,
        };

        if (!useBasicError) {
            payload.error = {
                code: status,
                message: message,
                error_code: error_code,
                data: data,
            };
        }

        response.status(status).json(payload);
    }
}
