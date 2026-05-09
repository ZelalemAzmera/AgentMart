import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  role: 'BUYER' | 'DEVELOPER' | 'ADMIN';
}

class JwtService {
  /**
   * Create a new JWT token
   */
  public createToken(payload: JWTPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  /**
   * Verify and decode a JWT token
   */
  public verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
    }
  }
}

export const jwtService = new JwtService();
