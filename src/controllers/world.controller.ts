import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';
import {InventoryService} from '../services/inventory.service.js';
import {WorldRepository} from '../repositories/world.repository.js';

const worldRepo = new WorldRepository();
const worldService = new WorldService();
const inventoryService = new InventoryService(worldRepo);

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await worldService.save(req.user!.userId, req.body);
  res.status(200).json({message: 'Saved', data: result});
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await worldService.load(req.user!.userId);
  res.status(200).json({message: 'Loaded', data: result});
};

export const lootBlock = async (req: AuthenticatedRequest, res: Response) => {
  const block = await inventoryService.generateLoot(req.user!.userId);
  res.status(200).json({message: 'Loot generated', data: block});
};
