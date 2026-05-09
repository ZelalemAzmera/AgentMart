import { prisma } from '../config/database';
import { solanaService } from './solana.service';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export class PurchaseService {
  async verifyPurchase(buyerId: string, agentId: string, txSignature: string) {
    // 1. Check if signature already used
    const existingPurchase = await prisma.purchase.findUnique({
      where: { txSignature }
    });

    if (existingPurchase) {
      throw new AppError('Transaction signature has already been used', 400, 'TX_ALREADY_USED');
    }

    // 2. Fetch agent details
    const agent = await prisma.agent.findUnique({
      where: { id: agentId, isActive: true },
      include: { developer: true }
    });

    if (!agent) {
      throw new AppError('Agent not found or inactive', 404, 'AGENT_NOT_FOUND');
    }

    // 3. Get buyer wallet
    const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
    if (!buyer) throw new AppError('Buyer not found', 404, 'USER_NOT_FOUND');

    // 4. Create pending purchase record
    let purchase = await prisma.purchase.create({
      data: {
        txSignature,
        amountSOL: agent.priceSOL,
        status: 'PENDING',
        buyerId,
        agentId,
      }
    });

    try {
      // 5. Verify transaction on Solana devnet
      // Expected receiver is the developer's wallet (in a real scenario with a smart contract, it would be the PDA or program)
      const verification = await solanaService.verifyPurchaseTransaction(
        txSignature,
        buyer.walletAddress,
        agent.developer.walletAddress, // or PDA if using program
        agent.priceSOL
      );

      if (!verification.valid) {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED', failReason: verification.error }
        });
        throw new AppError(`Verification failed: ${verification.error}`, 400, 'VERIFICATION_FAILED');
      }

      // 6. Update purchase as confirmed
      purchase = await prisma.purchase.update({
        where: { id: purchase.id },
        data: { 
          status: 'CONFIRMED', 
          verifiedOnChain: true,
          amountSOL: verification.actualAmount || agent.priceSOL
        }
      });

      // 7. Increment agent sales and developer earnings
      await prisma.agent.update({
        where: { id: agentId },
        data: {
          totalSales: { increment: 1 },
          totalEarnings: { increment: agent.priceSOL }
        }
      });

      return {
        purchase,
        agentUrl: agent.agentUrl // Grant access to the URL
      };

    } catch (error) {
      // Catch any unexpected errors during verification
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: 'FAILED', failReason: 'Unexpected error during verification' }
      });
      throw error;
    }
  }

  async getBuyerPurchases(buyerId: string) {
    return prisma.purchase.findMany({
      where: { buyerId, status: 'CONFIRMED' },
      include: {
        agent: {
          select: { id: true, name: true, slug: true, imageUrl: true, category: true, shortDesc: true, agentUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPurchaseDetails(buyerId: string, purchaseId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, buyerId },
      include: {
        agent: {
          select: { id: true, name: true, slug: true, imageUrl: true, agentUrl: true, developer: { select: { displayName: true } } }
        }
      }
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404, 'PURCHASE_NOT_FOUND');
    }

    return purchase;
  }
}

export const purchaseService = new PurchaseService();
