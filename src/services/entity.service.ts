import { EntityRepository } from '../repositories/entity.repository.js';
import { saveStateSchema } from '../validators/world.validator.js';

export class EntityService {
  private repo = new EntityRepository();

  async getEntityState(entityId: string, userId: string) {
    const entity = await this.repo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');
    const save = await this.repo.getPlayerSave(userId);
    
    let isFixed = false;
    if (save && save.data) {
      const parsedData = saveStateSchema.parse(save.data);
      isFixed = parsedData.fixedGlitches.includes(entityId);
    }

    return { id: entityId, isFixed };
  }
}