import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} - ${err.message}`);
    return sendError(res, err.message, err.code, err.statusCode);
  }

  logger.error(`[Unhandled Error] ${err.message}`, err);
  
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    'INTERNAL_SERVER_ERROR',
    500
  );
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'NOT_FOUND'));
};
