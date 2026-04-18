import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {InventoryService} from './inventory.service.js';
import {ValueMatchStrategy} from './strategies/value-match.strategy.js';
import {NotFoundError} from '../errors/errors.js';

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

    const strategy = new ValueMatchStrategy();
    const result = strategy.validate(
      answers,
      entity.solutionMap as Record<string, any>,
      state.inventory as any[],
    );

    if (!result.correct) {
      return {
        success: false,
        wrongSlot: result.wrongSlot,
        message: result.message,
      };
    }

    await this.inventoryService.consumeBlocks(
      userId,
      result.usedBlockIds!,
      state.version,
    );
    await this.worldRepo.addFixedGlitch(userId, entityId);

    const updatedState = await this.worldRepo.getWorldState(userId);
    return {
      success: true,
      message: 'Fixed!',
      fixedGlitches: updatedState!.fixedGlitches.map((g) => g.id),
    };
  }
}
