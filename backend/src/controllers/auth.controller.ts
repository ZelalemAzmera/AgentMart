import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { solanaService } from '../services/solana.service';
import { jwtService } from '../services/jwt.service';
import { AppError } from '../utils/errors';
import crypto from 'crypto';

export const getNonce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallet } = req.query as { wallet: string };

    // Generate a random nonce string
    const nonceString = `AgentMart-sign-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in database
    await prisma.nonce.create({
      data: {
        walletAddress: wallet,
        nonce: nonceString,
        expiresAt
      }
    });

    return sendSuccess(res, { nonce: nonceString, expiresAt }, 'Nonce generated successfully');
  } catch (error) {
    next(error);
  }
};

export const verifySignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, signature, nonce } = req.body;

    // Find the nonce in the database
    const nonceRecord = await prisma.nonce.findUnique({
      where: { nonce }
    });

    if (!nonceRecord) {
      throw new AppError('Invalid nonce', 400, 'INVALID_NONCE');
    }

    if (nonceRecord.used) {
      throw new AppError('Nonce has already been used', 400, 'NONCE_USED');
    }

    if (nonceRecord.walletAddress !== walletAddress) {
      throw new AppError('Nonce does not match wallet address', 400, 'NONCE_WALLET_MISMATCH');
    }

    if (new Date() > nonceRecord.expiresAt) {
      throw new AppError('Nonce has expired', 400, 'NONCE_EXPIRED');
    }

    // Construct the exact message that the frontend signed
    const messageToVerify = `Sign this message to authenticate with AgentMart.\nNonce: ${nonce}`;

    // Verify signature using solana service
    const isValid = solanaService.verifyWalletSignature(walletAddress, messageToVerify, signature);

    if (!isValid) {
      throw new AppError('Invalid signature', 401, 'INVALID_SIGNATURE');
    }

    // Mark nonce as used
    await prisma.nonce.update({
      where: { id: nonceRecord.id },
      data: { used: true }
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      // Create a new user
      user = await prisma.user.create({
        data: {
          walletAddress,
          role: 'BUYER' // Default role
        }
      });
    }

    // Generate JWT
    const token = jwtService.createToken({
      userId: user.id,
      walletAddress: user.walletAddress,
      role: user.role
    });

    return sendSuccess(res, { token, user }, 'Authentication successful');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return sendSuccess(res, { user }, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
