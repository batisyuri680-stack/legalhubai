import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    const errors: any[] = [];

    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        statusCode = HttpStatus.CONFLICT;
        message = 'Record with this value already exists';
        const field = (exception.meta?.target as string[])?.[0];
        errors.push({ field, message: `${field} must be unique` });
        break;

      case 'P2025':
        // Record not found
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;

      case 'P2003':
        // Foreign key constraint violation
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Invalid relationship reference';
        break;

      case 'P2014':
        // Required relation violation
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Required field is missing';
        break;

      case 'P2011':
        // Null constraint violation
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Required field cannot be null';
        const nullField = (exception.meta?.column_name as string) || 'field';
        errors.push({ field: nullField, message: `${nullField} is required` });
        break;

      default:
        this.logger.warn(`Unhandled Prisma error code: ${exception.code}`);
    }

    const errorResponse = {
      statusCode,
      message,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `Prisma Error ${exception.code}: ${message}`,
      exception.stack,
    );

    response.status(statusCode).json(errorResponse);
  }
}
