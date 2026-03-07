import { EntityRepository } from '../repositories/entity.repository.js';
import { WorldRepository } from '../repositories/world.repository.js';
import { saveStateSchema } from '../validators/world.validator.js';
import { entityCodeSchema } from '../validators/entity.validator.js';

export class EntityService {
  private entityRepo = new EntityRepository();
  private worldRepo = new WorldRepository();

  async getEntityState(entityId: string, userId: string) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new Error('ENTITY_NOT_FOUND');


    const saveState = await this.worldRepo.getWorldState(userId);

  
    let isFixed = false;
    if (saveState && saveState.data) {
      const parsedSave = saveStateSchema.parse(saveState.data);
      isFixed = parsedSave.fixedGlitches.includes(entityId);
    }

    const rawCode = isFixed ? entity.fixedCode : entity.glitchedCode;
    const validatedCode = entityCodeSchema.parse(rawCode);

    return {
      id: entity.id,
      isFixed: isFixed,
      code: validatedCode
    };
  }
}