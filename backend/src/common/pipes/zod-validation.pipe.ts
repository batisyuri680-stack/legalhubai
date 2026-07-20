import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const result = this.schema.parse(value);
      return result;
    } catch (error: any) {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
    }
  }
}
