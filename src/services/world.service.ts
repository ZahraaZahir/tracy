import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema, SaveStateData} from '../validators/world.validator.js';
import {LogicBlockSchema} from '../validators/inventory.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class WorldService {
  private worldRepo = new WorldRepository();
  private entityRepo = new EntityRepository();

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

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new NotFoundError(`NPC ${entityId} not found`);

    if (await this.isEntityFixed(userId, entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed'};
    }

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;

    for (const slotId in solutions) {
      const blockParse = LogicBlockSchema.safeParse(answers[slotId]);

      if (!blockParse.success) {
        return {success: false, wrongSlot: slotId, message: 'Invalid block'};
      }

      const playerValueSnapshot = JSON.stringify(blockParse.data.value);
      const correctValueSnapshot = JSON.stringify(solutions[slotId]);

      if (playerValueSnapshot !== correctValueSnapshot) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch',
        };
      }
    }

    await this.worldRepo.addFixedGlitch(userId, entityId);
    const updated = await this.load(userId);

    return {
      success: true,
      message: 'Fixed!',
      fixedGlitches: updated.fixedGlitches,
      totalEntities: updated.totalEntities,
    };
  }
}
