import { Request, Response, NextFunction } from 'express';
import { jwtService, JWTPayload } from '../services/jwt.service';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authenticated. No token provided.', 401, 'NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireDeveloper = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, (err?: any) => {
    if (err) return next(err);
    
    if (req.user?.role !== 'DEVELOPER' && req.user?.role !== 'ADMIN') {
      return next(new AppError('Forbidden. Developer access required.', 403, 'FORBIDDEN_ROLE'));
    }
    
    next();
  });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, (err?: any) => {
    if (err) return next(err);
    
    if (req.user?.role !== 'ADMIN') {
      return next(new AppError('Forbidden. Admin access required.', 403, 'FORBIDDEN_ROLE'));
    }
    
    next();
  });
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwtService.verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // If token is invalid, just ignore it and proceed as unauthenticated
    next();
  }
};
