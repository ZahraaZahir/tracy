import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {SaveStateData} from '../validators/world.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class WorldService {
  constructor(
    private worldRepo: WorldRepository,
    private entityRepo: EntityRepository,
  ) {}

  async save(userId: string, data: SaveStateData) {
    await this.worldRepo.saveWorldState(userId, data);
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
