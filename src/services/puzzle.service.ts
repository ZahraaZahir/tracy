import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';
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
    private validator: PuzzleStrategy,
  ) {}

  async solve(
    userId: string,
    entityId: string,
    answers: Record<string, LogicBlock>,
  ) {
    const [entity, state] = await Promise.all([
      this.entityRepo.getEntityById(entityId),
      this.worldRepo.getWorldState(userId),
    ]);

    if (!entity) throw new NotFoundError(`NPC ${entityId} not found`);
    if (!state) throw new NotFoundError('Save state missing');

    if (state.fixedGlitches.some((g) => g.id === entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed'};
    }

    const inventory = InventorySchema.parse(state.inventory || []);

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

    try {
      const updatedState = await this.worldRepo.completePuzzleAtomic(
        userId,
        entityId,
        result.usedBlockIds,
        state.version,
      );

      return {
        success: true,
        message: 'Fixed!',
        fixedGlitches: updatedState.fixedGlitches.map((g) => g.id),
        totalEntities: await this.entityRepo.countAllEntities(),
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'VERSION_CONFLICT') {
        throw new AppError('State conflict detected. Retry.', 409);
      }
      throw error;
    }
  }
}
