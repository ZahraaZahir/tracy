import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {LogicBlock} from '../validators/inventory.validator.js';
import {ConflictError, NotFoundError} from '../errors/errors.js';

export class InventoryService {
  constructor(
    private worldRepo: WorldRepository,
    private entityRepo: EntityRepository,
  ) {}

  async generateLoot(userId: string): Promise<LogicBlock> {
    const [allSolutions, state] = await Promise.all([
      this.entityRepo.getAllSolutionMaps(),
      this.worldRepo.getWorldState(userId),
    ]);

    if (!state) throw new NotFoundError('Save state missing');

    const fixedIds = new Set(state.fixedGlitches.map((g) => g.id));

    const pool = allSolutions
      .filter((e) => !fixedIds.has(e.id))
      .flatMap((e) => Object.values(e.solutionMap));

    if (pool.length === 0) {
      throw new ConflictError('No loot available.');
    }

    const randomValue = pool[Math.floor(Math.random() * pool.length)];

    const block: LogicBlock = {
      blockId: uuidv4(),
      ...randomValue,
    };

    const savedBlock = await this.worldRepo.addBlockAtomic(userId, block);
    if (!savedBlock) throw new ConflictError('State conflict detected. Retry.');
    return savedBlock;
  }
}
