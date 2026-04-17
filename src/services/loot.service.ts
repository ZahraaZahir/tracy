import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {LogicBlock} from '../validators/inventory.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class LootService {
  private worldRepo = new WorldRepository();

  async generateLoot(userId: string): Promise<LogicBlock> {
    const block: LogicBlock = {
      blockId: uuidv4(),
      type: 'float',
      value: 9.81,
    };

    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('SaveState not found');

    const currentInventory = Array.isArray(state.inventory)
      ? (state.inventory as any[])
      : [];

    const nextInventory = [...currentInventory, block];

    const success = await this.worldRepo.updateSaveStateCAS(
      userId,
      {inventory: nextInventory},
      state.version,
    );

    if (!success) {
      throw new Error(
        'Concurrency collision: failed to update inventory. Retry request.',
      );
    }

    return block;
  }
}
