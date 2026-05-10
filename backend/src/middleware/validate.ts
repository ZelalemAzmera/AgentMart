import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/errors';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;
      if (validatedData.body) req.body = validatedData.body;
      if (validatedData.query) {
        Object.defineProperty(req, 'query', { value: validatedData.query, configurable: true });
      }
      if (validatedData.params) {
        Object.defineProperty(req, 'params', { value: validatedData.params, configurable: true });
      }
      next();
      } catch (error: any) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const issues = zodError.errors || zodError.issues || [];
        const errorMessages = issues.length > 0 
          ? issues.map((err: any) => `${err.path?.join('.')}: ${err.message}`).join(', ')
          : error.message;
        return next(new AppError(`Validation failed: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      next(error);
    }
  };
};
