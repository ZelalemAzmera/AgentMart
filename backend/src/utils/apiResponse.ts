import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, error: string, code?: string, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
    code,
  });
};
