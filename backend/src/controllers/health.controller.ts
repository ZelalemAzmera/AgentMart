import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { prisma } from '../config/database';

export const getHealth = async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }

  return sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      // solana: 'connected' -> will be added after solana service is ready
    }
  }, 'Server is healthy');
};
