import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { slugify } from '../utils/slugify';
import { AppError } from '../utils/errors';

export class AgentService {
  async getAgents(params: any) {
    const { category, minPrice, maxPrice, search, tags, page, limit, sortBy, order } = params;

    const where: Prisma.AgentWhereInput = {
      isActive: true,
      isApproved: true,
    };

    if (category) where.category = category;
    if (minPrice !== undefined) where.priceSOL = { gte: minPrice };
    if (maxPrice !== undefined) {
      where.priceSOL = where.priceSOL ? { ...(where.priceSOL as any), lte: maxPrice } : { lte: maxPrice };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (tags) {
      const tagList = tags.split(',').map((t: string) => t.trim());
      where.tags = { hasSome: tagList };
    }

    const skip = (page - 1) * limit;

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDesc: true,
          category: true,
          tags: true,
          demoUrl: true,
          imageUrl: true,
          priceSOL: true,
          totalSales: true,
          createdAt: true,
          developer: {
            select: { id: true, displayName: true, walletAddress: true, avatarUrl: true }
          }
        }
      }),
      prisma.agent.count({ where })
    ]);

    return {
      agents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getAgentBySlug(slug: string) {
    const agent = await prisma.agent.findUnique({
      where: { slug, isActive: true, isApproved: true },
      include: {
        developer: {
          select: { id: true, displayName: true, walletAddress: true, avatarUrl: true }
        },
        reviews: {
          include: {
            user: { select: { id: true, displayName: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!agent) throw new AppError('Agent not found', 404, 'AGENT_NOT_FOUND');

    // Never expose the actual agent URL in public queries
    const { agentUrl, ...publicAgentData } = agent;
    return publicAgentData;
  }

  async createAgent(developerId: string, data: any) {
    let slug = slugify(data.name);
    
    // Check slug uniqueness
    const existing = await prisma.agent.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    return prisma.agent.create({
      data: {
        ...data,
        slug,
        developerId,
        isApproved: false // Requires admin approval
      }
    });
  }

  async updateAgent(developerId: string, agentId: string, data: any) {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    
    if (!agent) throw new AppError('Agent not found', 404, 'AGENT_NOT_FOUND');
    if (agent.developerId !== developerId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

    // If name changes, we could update slug, but it's usually better to keep slug stable
    
    return prisma.agent.update({
      where: { id: agentId },
      data
    });
  }

  async getCategories() {
    // Get count of approved active agents per category
    const categories = await prisma.agent.groupBy({
      by: ['category'],
      where: { isActive: true, isApproved: true },
      _count: { category: true }
    });

    return categories.map(c => ({
      category: c.category,
      count: c._count.category
    }));
  }
}

export const agentService = new AgentService();
