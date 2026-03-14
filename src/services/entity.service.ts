import { EntityRepository } from '../repositories/entity.repository.js';

export class EntityService {
  private repo = new EntityRepository();

  async getEntityState(entityId: string, userId: string) {
      const entity = await this.repo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');

    const isFixed = await this.repo.isFixed(userId, entityId);

   
    const activeCode = isFixed ? entity.fixedCode : entity.glitchedCode;
    
    return {
      id: entityId,
      isFixed,
      puzzleCode: activeCode
    };
  }
}