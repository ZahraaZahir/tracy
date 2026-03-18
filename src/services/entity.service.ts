import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';

export class EntityService {
  private entityRepo = new EntityRepository();
  private worldRepo = new WorldRepository();

  async getEntityState(entityId: string, userId: string) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');

    const save = await this.worldRepo.getWorldState(userId);
    const isFixed = save?.fixedGlitches.includes(entityId) ?? false;

    return {
      id: entityId,
      isFixed,
      templateCode: entity.templateCode,
      solutionMap: isFixed ? entity.solutionMap : null,
      errorMessages: isFixed ? entity.errorMessages : null,
    };
  }

  async solveEntity(
    entityId: string,
    userId: string,
    submittedAnswers: Record<string, any>,
  ) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');

    const save = await this.worldRepo.getWorldState(userId);
    if (save?.fixedGlitches.includes(entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed.'};
    }

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;

    for (const slotId in solutions) {
      const playerValue = submittedAnswers[slotId];
      const correctValue = solutions[slotId];

      if (playerValue === undefined || playerValue === null) {
        return {success: false, wrongSlot: slotId, message: 'Slot is empty.'};
      }

      if (String(playerValue) !== String(correctValue)) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch detected.',
        };
      }
    }

    await this.worldRepo.addFixedGlitch(userId, entityId);
    return {success: true, message: 'Entity is fixed!'};
  }
}
