import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {
  LogicBlock,
  InventorySchema,
  SolutionValue,
} from '../validators/inventory.validator.js';
import {ConflictError, NotFoundError} from '../errors/errors.js';

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

    const fixedIds = new Set((state.fixedGlitches ?? []).map((g) => g.id));

    const currentInventory = InventorySchema.parse(state.inventory || []);

    const requiredBlocks = allSolutions
      .filter((e) => !fixedIds.has(e.id))
      .flatMap((e) => Object.values(e.solutionMap));

    requiredBlocks.sort(() => Math.random() - 0.5);

    const inventorySet = new Set(
      currentInventory.map((b) => `${b.type}:${JSON.stringify(b.value)}`),
    );

    for (const req of requiredBlocks) {
      const key = `${req.type}:${JSON.stringify(req.value)}`;
      if (!inventorySet.has(key)) {
        return this.createAndSaveBlock(userId, req);
      }
    }

    throw new ConflictError("You don't need any more loot right now.");
  }
}
