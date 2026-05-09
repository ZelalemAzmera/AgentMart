import { Request, Response, NextFunction } from 'express';
import { accessService } from '../services/access.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const agentId = req.params.agentId as string;

    const hasAccess = await accessService.checkAccess(buyerId, agentId);
    return sendSuccess(res, { hasAccess }, 'Access check complete');
  } catch (error) {
    next(error);
  }
};

export const grantAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const agentId = req.params.agentId as string;

    const agentUrl = await accessService.grantAccess(buyerId, agentId);

    if (!agentUrl) {
      throw new AppError('Access denied. You must purchase this agent first or it is inactive.', 403, 'ACCESS_DENIED');
    }

    return sendSuccess(res, { agentUrl }, 'Access granted');
  } catch (error) {
    next(error);
  }
};

export const getMyAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const agents = await accessService.getMyAgents(buyerId);
    
    return sendSuccess(res, { agents }, 'Purchased agents retrieved');
  } catch (error) {
    next(error);
  }
};
