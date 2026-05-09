import { Request, Response, NextFunction } from 'express';
import { agentService } from '../services/agent.service';
import { sendSuccess } from '../utils/apiResponse';

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await agentService.getAgents(req.query);
    return sendSuccess(res, result, 'Agents retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAgentBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const agent = await agentService.getAgentBySlug(slug);
    return sendSuccess(res, { agent }, 'Agent retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is guaranteed by requireDeveloper middleware
    const developerId = req.user!.userId;
    const agent = await agentService.createAgent(developerId, req.body);
    
    return sendSuccess(res, { agent }, 'Agent created successfully. Pending approval.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const developerId = req.user!.userId;
    const id = req.params.id as string;
    const agent = await agentService.updateAgent(developerId, id, req.body);
    
    return sendSuccess(res, { agent }, 'Agent updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await agentService.getCategories();
    return sendSuccess(res, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};
