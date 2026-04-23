import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {
  LogicBlock,
  InventorySchema,
  SolutionValue,
} from '../validators/inventory.validator.js';
import {ConflictError, NotFoundError} from '../errors/errors.js';

const createFrequencyMap = (
  blocks: Array<{type: string; value: any}>,
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const block of blocks) {
    const key = `${block.type}:${JSON.stringify(block.value)}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
};

export class InventoryService {
  constructor(
    private worldRepo: WorldRepository,
    private entityRepo: EntityRepository,
  ) {}

  private async createAndSaveBlock(
    userId: string,
    data: SolutionValue,
  ): Promise<LogicBlock> {
    const block: LogicBlock = {
      blockId: uuidv4(),
      ...data,
    };

    const savedBlock = await this.worldRepo.addBlockAtomic(userId, block);
    if (!savedBlock) throw new ConflictError('State conflict detected. Retry.');
    return savedBlock;
  }

  async generateLoot(userId: string): Promise<LogicBlock> {
    const [allSolutions, state] = await Promise.all([
      this.entityRepo.getAllSolutionMaps(),
      this.worldRepo.getWorldState(userId),
    ]);

    if (!state) throw new NotFoundError('Save state missing');

    const fixedIds = new Set(state.fixedGlitches.map((g) => g.id));
    const currentInventory = InventorySchema.parse(state.inventory || []);

    const requiredBlocks = allSolutions
      .filter((e) => !fixedIds.has(e.id))
      .flatMap((e) => Object.values(e.solutionMap));

    const inventoryMap = new Map<string, number>();
    for (const b of currentInventory) {
      const key = `${b.type}:${JSON.stringify(b.value)}`;
      inventoryMap.set(key, (inventoryMap.get(key) || 0) + 1);
    }

    for (const req of requiredBlocks) {
      const key = `${req.type}:${JSON.stringify(req.value)}`;
      const count = inventoryMap.get(key) || 0;
      if (count === 0) {
        return this.createAndSaveBlock(userId, req);
      }
    }

    throw new ConflictError("You don't need any more loot right now.");
  }
}
