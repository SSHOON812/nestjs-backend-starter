import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    LoggerService
} from "@nestjs/common";

import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(private readonly logger: LoggerService) { }

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();


        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === "object") {
                message = (exceptionResponse as any).message;
            }
        }

        this.logger.error(`${status} ${request.url} - ${message}`);

        response.status(status).json({
            success: false,
            message,
            errorCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}