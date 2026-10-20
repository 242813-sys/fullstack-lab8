import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
    exceptionFactory: (errors: ValidationError[] = []) => {
      const details: string[] = [];
      const extractErrors = (validationErrors: ValidationError[]) => {
        for (const error of validationErrors) {
          if (error.constraints) {
            details.push(...Object.values(error.constraints));
          }
          if (error.children && error.children.length > 0) {
            extractErrors(error.children);
          }
        }
      };
      extractErrors(errors);
      return new BadRequestException({
        statusCode: 400,
        error: 'Validation failed',
        details,
      });
    },
  });
}
