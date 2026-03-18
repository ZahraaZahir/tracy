import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';
import {INITIAL_GAME_STATE} from '../config/game.config.js';

export class WorldService {
  private worldRepo = new WorldRepository();
  private entityRepo = new EntityRepository();

  async save(userId: string, rawData: any) {
    const validData = saveStateSchema.parse(rawData);
    return await this.worldRepo.saveWorldState(userId, validData);
  }

  async load(userId: string) {
    const save = await this.worldRepo.getWorldState(userId);
    if (!save) return {...INITIAL_GAME_STATE, fixedGlitches: []};
    return save;
  }

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new Error('NOT_FOUND');

    const save = await this.worldRepo.getWorldState(userId);
    if (save?.fixedGlitches.includes(entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed.'};
    }

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;

    for (const slotId in solutions) {
      const playerValue = answers[slotId];
      const correctValue = solutions[slotId];

      if (playerValue === undefined || playerValue === null) {
        return {success: false, wrongSlot: slotId, message: 'Slot is empty.'};
      }
      if (String(playerValue) !== String(correctValue)) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch detected.',
        };
      }
    }

    await this.worldRepo.addFixedGlitch(userId, entityId);
    return {success: true, message: 'Entity is fixed!'};
  }
}
