import { Request, Response, NextFunction } from 'express';
import { purchaseService } from '../services/purchase.service';
import { sendSuccess } from '../utils/apiResponse';

export const verifyPurchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const { agentId, txSignature } = req.body;

    const result = await purchaseService.verifyPurchase(buyerId, agentId, txSignature);
    
    return sendSuccess(res, result, 'Purchase verified successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyPurchases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const purchases = await purchaseService.getBuyerPurchases(buyerId);
    
    return sendSuccess(res, { purchases }, 'Purchases retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getPurchaseDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const purchaseId = req.params.id as string;

    const purchase = await purchaseService.getPurchaseDetails(buyerId, purchaseId);
    
    return sendSuccess(res, { purchase }, 'Purchase details retrieved');
  } catch (error) {
    next(error);
  }
};
