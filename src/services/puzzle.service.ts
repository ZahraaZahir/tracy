import { EntityRepository } from '../repositories/entity.repository.js';
import { WorldRepository } from '../repositories/world.repository.js';
import { LogicBlock } from '../validators/inventory.validator.js';
import { PuzzleStrategy } from './strategies/puzzle.strategy.js';
import { NotFoundError } from '../errors/errors.js';

export class PuzzleService {
  constructor(
    private entityRepo: EntityRepository,
    private worldRepo: WorldRepository,
    private validator: PuzzleStrategy,
  ) {}

  async solve(userId: string, entityId: string, answers: Record<string, LogicBlock>) {
    const [entity, state] = await Promise.all([
      this.entityRepo.getEntityById(entityId),
      this.worldRepo.getWorldState(userId),
    ]);

    if (!entity || !state) throw new NotFoundError('Data missing');
    if (state.fixedGlitches.some((g) => g.id === entityId)) return { success: true, alreadySolved: true };

    const result = this.validator.validate(answers, entity.solutionMap!, state.inventory as any, entity.errorMessages);
    if (!result.correct) return { success: false, wrongSlot: result.wrongSlot, message: result.message };

    const updatedState = await this.worldRepo.completePuzzleAtomic(userId, entityId, result.usedBlockIds, state.version);

    return {
      success: true,
      fixedCount: updatedState.fixedGlitches.length, // Used for leaderboard update
      fixedGlitches: updatedState.fixedGlitches.map((g) => g.id)
    };
  }
}