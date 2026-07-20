import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      message: this.getMessage(exceptionResponse),
      errors: this.getErrors(exceptionResponse),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private getMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      return exceptionResponse.message;
    }

    return 'Internal Server Error';
  }

  private getErrors(exceptionResponse: any): any[] {
    if (Array.isArray(exceptionResponse)) {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && 'error' in exceptionResponse) {
      const error = exceptionResponse.error;
      if (Array.isArray(error)) {
        return error;
      }
      return [{ field: 'general', message: error }];
    }

    return [];
  }
}
