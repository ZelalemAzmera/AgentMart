import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const getPendingAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await prisma.agent.findMany({
      where: { isApproved: false },
      include: {
        developer: { select: { displayName: true, walletAddress: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    return sendSuccess(res, { agents }, 'Pending agents retrieved');
  } catch (error) {
    next(error);
  }
};

export const approveAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const agent = await prisma.agent.update({
      where: { id },
      data: { isApproved: true }
    });

    return sendSuccess(res, { agent }, 'Agent approved successfully');
  } catch (error) {
    next(error);
  }
};

export const rejectAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    // In a real app we might store a rejection reason, but here we can just delete it or mark inactive
    const agent = await prisma.agent.delete({
      where: { id }
    });

    return sendSuccess(res, null, 'Agent rejected and removed');
  } catch (error) {
    next(error);
  }
};
