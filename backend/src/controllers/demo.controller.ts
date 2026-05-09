import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';
import crypto from 'crypto';

export const getDemoUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.params.agentId as string;

    const agent = await prisma.agent.findUnique({
      where: { id: agentId, isActive: true, isApproved: true },
      select: { id: true, name: true, demoUrl: true, priceSOL: true }
    });

    if (!agent) {
      throw new AppError('Agent not found', 404, 'AGENT_NOT_FOUND');
    }

    return sendSuccess(res, {
      agentId: agent.id,
      name: agent.name,
      demoUrl: agent.demoUrl,
      hasDemo: !!agent.demoUrl,
      priceSOL: agent.priceSOL
    }, 'Demo info retrieved');
  } catch (error) {
    next(error);
  }
};

export const logDemoUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.params.agentId as string;
    
    // Simple IP hash for basic analytics without storing raw IPs
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('md5').update(ip).digest('hex');

    await prisma.demoLog.create({
      data: {
        agentId,
        ipHash
      }
    });

    return sendSuccess(res, null, 'Demo usage logged');
  } catch (error) {
    next(error);
  }
};
