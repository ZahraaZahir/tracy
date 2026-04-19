import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';
import {InventoryService} from '../services/inventory.service.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';

const worldRepo = new WorldRepository();
const entityRepo = new EntityRepository();
const worldService = new WorldService(worldRepo, entityRepo);
const inventoryService = new InventoryService(worldRepo);

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  const data = saveStateSchema.parse(req.body);
  const result = await worldService.save(req.user!.userId, data);
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
