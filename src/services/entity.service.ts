import {EntityRepository} from '../repositories/entity.repository.js';

export class EntityService {
  private entityRepo = new EntityRepository();

  async getEntityState(entityId: string, userId: string) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');

    const isFixed = await this.entityRepo.isFixed(userId, entityId);

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

    const alreadyFixed = await this.entityRepo.isFixed(userId, entityId);
    if (alreadyFixed) return {success: true, message: 'Already fixed.'};

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;

    for (const slotId in solutions) {
      const playerValue = submittedAnswers[slotId];
      const correctValue = solutions[slotId];

      if (playerValue === undefined || playerValue === null) {
        return {
          success: false,
          wrongSlot: slotId,
          message: 'This logic slot is empty.',
        };
      }

      if (String(playerValue) !== String(correctValue)) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch detected.',
        };
      }
    }

    await this.entityRepo.markAsFixed(userId, entityId);

    return {success: true, message: 'Entity is fixed!'};
  }
}
