import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {
  InventorySchema,
  LogicBlock,
} from '../validators/inventory.validator.js';
import {NotFoundError, ConflictError} from '../errors/errors.js';

export class InventoryService {
  constructor(private worldRepo: WorldRepository) {}

  async generateLoot(userId: string): Promise<LogicBlock> {
    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('SaveState missing');

    const inventory = InventorySchema.parse(
      Array.isArray(state.inventory) ? state.inventory : [],
    );

    const block: LogicBlock = {
      blockId: uuidv4(),
      type: 'float',
      value: 9.81,
    };

    const success = await this.worldRepo.updateSaveStateCAS(
      userId,
      [...inventory, block],
      state.version,
    );

    if (!success) throw new ConflictError('State conflict detected. Retry.');
    return block;
  }

  async consumeBlocks(
    userId: string,
    currentInventory: LogicBlock[],
    blockIds: string[],
    oldVersion: number,
  ): Promise<boolean> {
    const nextInventory = currentInventory.filter(
      (b) => !blockIds.includes(b.blockId),
    );
    return await this.worldRepo.updateSaveStateCAS(
      userId,
      nextInventory,
      oldVersion,
    );
  }
}
