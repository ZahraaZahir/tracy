import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';
import {NotFoundError} from '../errors/errors.js';

export class WorldService {
  private worldRepo = new WorldRepository();
  private entityRepo = new EntityRepository();

  async isEntityFixed(userId: string, entityId: string): Promise<boolean> {
    const save = await this.worldRepo.getWorldState(userId);
    return save?.fixedGlitches.includes(entityId) ?? false;
  }

  async save(userId: string, rawData: any) {
    const validData = saveStateSchema.parse(rawData);
    await this.worldRepo.saveWorldState(userId, validData);

    return await this.load(userId);
  }

  async load(userId: string) {
    const [save, totalEntities] = await Promise.all([
      this.worldRepo.getWorldState(userId),
      this.entityRepo.countAllEntities(),
    ]);

    if (!save) {
      return {
        posX: 0,
        posY: 0,
        mapName: 'main_world',
        fixedGlitches: [],
        totalEntities,
      };
    }

    return {
      ...save,
      totalEntities,
    };
  }

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) {
      throw new NotFoundError(`NPC with ID ${entityId} not found.`);
    }

    const isAlreadyFixed = await this.isEntityFixed(userId, entityId);
    if (isAlreadyFixed) {
      return {
        success: true,
        alreadySolved: true,
        message: 'Entity has already been fixed!',
      };
    }

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;

    for (const slotId in solutions) {
      const playerValue = answers[slotId];
      const correctValue = solutions[slotId];

      if (playerValue === undefined || playerValue === null) {
        return {
          success: false,
          wrongSlot: slotId,
          message: 'Logic block missing.',
        };
      }

      const playerSnapshot = JSON.stringify(playerValue);
      const correctSnapshot = JSON.stringify(correctValue);

      if (playerSnapshot !== correctSnapshot) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch detected.',
        };
      }
    }
    await this.worldRepo.addFixedGlitch(userId, entityId);

    const updatedState = await this.load(userId);

    return {
      success: true,
      message: 'Entity is fixed!',
      fixedGlitches: updatedState.fixedGlitches,
      totalEntities: updatedState.totalEntities,
    };
  }
}
