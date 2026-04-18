import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {InventoryService} from './inventory.service.js';
import {
  LogicBlockSchema,
  LogicBlock,
} from '../validators/inventory.validator.js';
import {NotFoundError, UnauthorizedError, AppError} from '../errors/errors.js';

export class PuzzleService {
  private entityRepo = new EntityRepository();
  private worldRepo = new WorldRepository();
  private inventoryService = new InventoryService();

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new NotFoundError(`NPC ${entityId} not found`);

    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('Save state missing');

    if (state.fixedGlitches.some((g) => g.id === entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed'};
    }

    const inventory = Array.isArray(state.inventory)
      ? (state.inventory as LogicBlock[])
      : [];
    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;
    const usedBlockIds: string[] = [];

    for (const slotId of Object.keys(solutions)) {
      const blockParse = LogicBlockSchema.safeParse(answers[slotId]);
      if (!blockParse.success)
        return {success: false, wrongSlot: slotId, message: 'Invalid block'};

      const playerBlock = blockParse.data;
      if (!inventory.some((b) => b.blockId === playerBlock.blockId)) {
        throw new UnauthorizedError(`Block ${playerBlock.blockId} not owned.`);
      }

      if (
        JSON.stringify(playerBlock.value) !== JSON.stringify(solutions[slotId])
      ) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch',
        };
      }
      usedBlockIds.push(playerBlock.blockId);
    }

    const success = await this.inventoryService.consumeBlocks(
      userId,
      usedBlockIds,
      state.version,
    );
    if (!success) throw new AppError('State conflict detected. Retry.', 409);

    await this.worldRepo.addFixedGlitch(userId, entityId);

    const [updatedState, totalEntities] = await Promise.all([
      this.worldRepo.getWorldState(userId),
      this.entityRepo.countAllEntities(),
    ]);

    return {
      success: true,
      message: 'Fixed!',
      fixedGlitches: updatedState!.fixedGlitches.map((g) => g.id),
      totalEntities,
    };
  }
}
