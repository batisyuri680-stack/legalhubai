import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const { method, url, ip } = request;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.logger.debug(
            `${method} ${url} - ${ip} - ${duration}ms - SUCCESS`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} - ${ip} - ${duration}ms - ERROR: ${error.message}`,
          );
        },
      }),
    );
  }
}
