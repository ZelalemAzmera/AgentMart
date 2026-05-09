import { prisma } from '../config/database';

export class AccessService {
  async checkAccess(buyerId: string, agentId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        buyerId,
        agentId,
        status: 'CONFIRMED'
      }
    });

    return !!purchase;
  }

  async grantAccess(buyerId: string, agentId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        buyerId,
        agentId,
        status: 'CONFIRMED'
      },
      include: {
        agent: {
          select: { agentUrl: true, name: true, isActive: true }
        }
      }
    });

    if (!purchase || !purchase.agent.isActive) {
      return null;
    }

    return purchase.agent.agentUrl;
  }

  async getMyAgents(buyerId: string) {
    const purchases = await prisma.purchase.findMany({
      where: { buyerId, status: 'CONFIRMED' },
      include: {
        agent: {
          select: { id: true, name: true, slug: true, shortDesc: true, imageUrl: true, agentUrl: true }
        }
      }
    });

    return purchases.map(p => p.agent);
  }
}

export const accessService = new AccessService();
