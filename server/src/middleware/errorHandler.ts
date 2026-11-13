import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../utils/errors.js';
import { env } from '../config/env.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten(),
    });
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : 'Unexpected error',
  });
}
