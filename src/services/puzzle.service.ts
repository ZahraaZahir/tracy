import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {InventoryService} from './inventory.service.js';
import {
  InventorySchema,
  LogicBlock,
} from '../validators/inventory.validator.js';
import {PuzzleStrategy} from './strategies/puzzle.strategy.js';
import {NotFoundError, AppError} from '../errors/errors.js';

export class PuzzleService {
  constructor(
    private entityRepo: EntityRepository,
    private worldRepo: WorldRepository,
    private inventoryService: InventoryService,
    private validator: PuzzleStrategy,
  ) {}

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new NotFoundError(`NPC ${entityId} not found`);

    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('Save state missing');

    if (state.fixedGlitches.some((g) => g.id === entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed'};
    }

    const inventory = InventorySchema.parse(
      Array.isArray(state.inventory) ? state.inventory : [],
    );

    const result = this.validator.validate(
      answers,
      entity.solutionMap as Record<string, LogicBlock>,
      inventory,
    );

    if (!result.correct) {
      return {
        success: false,
        wrongSlot: result.wrongSlot,
        message: result.message,
      };
    }

    const success = await this.worldRepo.completePuzzleAtomic(
      userId,
      entityId,
      inventory.filter((b) => !result.usedBlockIds!.includes(b.blockId)),
      state.version,
    );

    if (!success) throw new AppError('State conflict detected. Retry.', 409);

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
