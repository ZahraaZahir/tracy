import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';

const worldService = new WorldService();

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await worldService.save(req.user!.userId, req.body);
  res
    .status(200)
    .json({message: 'World state saved successfully', data: result});
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await worldService.load(req.user!.userId);
  res
    .status(200)
    .json({message: 'World state loaded successfully', data: result});
};
