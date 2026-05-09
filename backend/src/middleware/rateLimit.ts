import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/errors';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    next(new AppError(options.message as string, options.statusCode, 'RATE_LIMIT_EXCEEDED'));
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 auth requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after an hour',
  handler: (req, res, next, options) => {
    next(new AppError(options.message as string, options.statusCode, 'AUTH_RATE_LIMIT_EXCEEDED'));
  }
});

export const demoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 demo requests per windowMs
  message: 'Too many demo requests from this IP, please try again after an hour',
  handler: (req, res, next, options) => {
    next(new AppError(options.message as string, options.statusCode, 'DEMO_RATE_LIMIT_EXCEEDED'));
  }
});
