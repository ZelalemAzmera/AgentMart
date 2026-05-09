import { z } from 'zod';

const CategoryEnum = z.enum([
  'IMAGE',
  'TEXT',
  'VOICE',
  'CODE',
  'DATA',
  'PRODUCTIVITY',
  'OTHER'
]);

export const createAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10),
    shortDesc: z.string().min(5).max(200),
    category: CategoryEnum,
    tags: z.array(z.string()).optional().default([]),
    agentUrl: z.string().url(),
    demoUrl: z.string().url().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    priceSOL: z.number().positive(),
  })
});

export const updateAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).optional(),
    shortDesc: z.string().min(5).max(200).optional(),
    category: CategoryEnum.optional(),
    tags: z.array(z.string()).optional(),
    agentUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    priceSOL: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  })
});

export const getAgentsQuerySchema = z.object({
  query: z.object({
    category: CategoryEnum.optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    search: z.string().optional(),
    tags: z.string().optional(), // Comma separated tags
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt', 'priceSOL', 'totalSales']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc')
  })
});
