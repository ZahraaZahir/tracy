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
}
