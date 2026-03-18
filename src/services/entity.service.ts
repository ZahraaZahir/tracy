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
}