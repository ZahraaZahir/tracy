import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';
import {InventoryService} from '../services/inventory.service.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';

let worldService: WorldService;
let inventoryService: InventoryService;

const initServices = () => {
  if (!worldService) {
    const worldRepo = new WorldRepository();
    const entityRepo = new EntityRepository();
    worldService = new WorldService(worldRepo, entityRepo);
    inventoryService = new InventoryService(worldRepo, entityRepo);
  }
};

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  initServices();
  const data = saveStateSchema.parse(req.body);
  const result = await worldService.save(req.user!.userId, data);

  res.status(200).json({message: 'State saved successfully', data: result});
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {
  initServices();
  const result = await worldService.load(req.user!.userId);
  res.status(200).json({message: 'Loaded', data: result});
};

export const lootBlock = async (req: AuthenticatedRequest, res: Response) => {
  initServices();
  const block = await inventoryService.generateLoot(req.user!.userId);
  res.status(200).json({message: 'Loot generated', data: block});
};
