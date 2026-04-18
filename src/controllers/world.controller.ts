import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';
import {InventoryService} from '../services/inventory.service.js';

let worldService: WorldService;
let inventoryService: InventoryService;

const getWorldService = () => {
  if (!worldService) worldService = new WorldService();
  return worldService;
};

const getInventoryService = () => {
  if (!inventoryService) inventoryService = new InventoryService();
  return inventoryService;
};

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getWorldService().save(req.user!.userId, req.body);
  res.status(200).json({message: 'Saved', data: result});
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getWorldService().load(req.user!.userId);
  res.status(200).json({message: 'Loaded', data: result});
};

export const lootBlock = async (req: AuthenticatedRequest, res: Response) => {
  const block = await getInventoryService().generateLoot(req.user!.userId);
  res.status(200).json({message: 'Loot generated', data: block});
};
