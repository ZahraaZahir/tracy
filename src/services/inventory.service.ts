import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {LogicBlock} from '../validators/inventory.validator.js';
import {ConflictError} from '../errors/errors.js';

export class InventoryService {
  constructor(private worldRepo: WorldRepository) {}

  async generateLoot(userId: string): Promise<LogicBlock> {
    // TODO: replace with real loot pool / randomization logic
    const block: LogicBlock = {
      blockId: uuidv4(),
      type: 'float',
      value: 9.81,
    };

    const savedBlock = await this.worldRepo.addBlockAtomic(userId, block);

    if (!savedBlock) throw new ConflictError('State conflict detected. Retry.');
    return savedBlock;
  }

  async consumeBlocks(userId: string, blockIds: string[]): Promise<void> {
    const success = await this.worldRepo.removeBlocksAtomic(userId, blockIds);
    if (!success) throw new ConflictError('State conflict detected. Retry.');
  }
}
