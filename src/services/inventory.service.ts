import {v4 as uuidv4} from 'uuid';
import {WorldRepository} from '../repositories/world.repository.js';
import {LogicBlock} from '../validators/inventory.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class InventoryService {
  private worldRepo = new WorldRepository();

  async generateLoot(userId: string): Promise<LogicBlock> {
    const block: LogicBlock = {
      blockId: uuidv4(),
      type: 'float',
      value: 9.81,
    };

    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('SaveState missing');

    const inventory = Array.isArray(state.inventory)
      ? (state.inventory as LogicBlock[])
      : [];
    const success = await this.worldRepo.updateSaveStateCAS(
      userId,
      {inventory: [...inventory, block]},
      state.version,
    );

    if (!success) throw new Error('Collision during loot');
    return block;
  }

  async consumeBlocks(
    userId: string,
    blockIds: string[],
    oldVersion: number,
  ): Promise<boolean> {
    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('SaveState missing');

    const inventory = Array.isArray(state.inventory)
      ? (state.inventory as LogicBlock[])
      : [];
    const nextInventory = inventory.filter(
      (b) => !blockIds.includes(b.blockId),
    );

    return await this.worldRepo.updateSaveStateCAS(
      userId,
      {inventory: nextInventory},
      oldVersion,
    );
  }
}
