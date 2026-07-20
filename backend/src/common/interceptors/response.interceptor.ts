import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ResponseFormat<T = any> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const message = this.getStatusMessage(statusCode);

        return {
          statusCode,
          message,
          data: data || null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getStatusMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      200: 'Success',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };

    return messages[statusCode] || 'Success';
  }
}
