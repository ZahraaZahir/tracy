import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';

let worldService: WorldService;

const getWorldService = () => {
  if (!worldService) worldService = new WorldService();
  return worldService;
};
export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getWorldService().save(req.user!.userId, req.body);
  res
    .status(200)
    .json({message: 'World state saved successfully', data: result});
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getWorldService().load(req.user!.userId);
  res
    .status(200)
    .json({message: 'World state loaded successfully', data: result});
};
