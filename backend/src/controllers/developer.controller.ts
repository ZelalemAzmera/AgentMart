import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const becomeDeveloper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'DEVELOPER' }
    });

    return sendSuccess(res, { role: user.role }, 'Successfully upgraded to Developer account');
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const developerId = req.user!.userId;

    const agents = await prisma.agent.findMany({
      where: { developerId }
    });

    const activeListings = agents.filter(a => a.isActive && a.isApproved).length;
    const pendingApproval = agents.filter(a => !a.isApproved).length;
    
    let totalEarnings = 0;
    let totalSales = 0;
    
    agents.forEach(a => {
      totalEarnings += a.totalEarnings;
      totalSales += a.totalSales;
    });

    // Get recent sales
    const agentIds = agents.map(a => a.id);
    const recentSales = await prisma.purchase.findMany({
      where: {
        agentId: { in: agentIds },
        status: 'CONFIRMED'
      },
      include: {
        buyer: { select: { walletAddress: true, displayName: true } },
        agent: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Top agent
    const topAgent = agents.sort((a, b) => b.totalSales - a.totalSales)[0];

    return sendSuccess(res, {
      totalEarnings,
      totalSales,
      activeListings,
      pendingApproval,
      recentSales,
      topAgent: topAgent ? { name: topAgent.name, sales: topAgent.totalSales } : null
    }, 'Dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const developerId = req.user!.userId;

    const agents = await prisma.agent.findMany({
      where: { developerId },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, { agents }, 'Listings retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const developerId = req.user!.userId;
    const { displayName, bio, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: developerId },
      data: { displayName, bio, avatarUrl }
    });

    return sendSuccess(res, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};
