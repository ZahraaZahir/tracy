import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema, SaveStateData} from '../validators/world.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class WorldService {
  constructor(
    private worldRepo: WorldRepository,
    private entityRepo: EntityRepository,
  ) {}

  async isEntityFixed(userId: string, entityId: string): Promise<boolean> {
    const save = await this.worldRepo.getWorldState(userId);
    if (!save) return false;
    return save.fixedGlitches.map((g) => g.id).includes(entityId);
  }

  async save(userId: string, rawData: SaveStateData) {
    const validData = saveStateSchema.parse(rawData);
    await this.worldRepo.saveWorldState(userId, validData);
    return await this.load(userId);
  }

  async load(userId: string) {
    const [save, totalEntities] = await Promise.all([
      this.worldRepo.getWorldState(userId),
      this.entityRepo.countAllEntities(),
    ]);

    if (!save) throw new NotFoundError('Save state missing');

    return {
      ...save,
      fixedGlitches: save.fixedGlitches.map((g) => g.id),
      totalEntities,
    };
  }
}
