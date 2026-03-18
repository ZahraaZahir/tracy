import {WorldRepository} from '../repositories/world.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';
import {INITIAL_GAME_STATE} from '../config/game.config.js';

export class WorldService {
  private worldRepo = new WorldRepository();

  async save(userId: string, rawData: any) {
    const validData = saveStateSchema.parse(rawData);
    return await this.worldRepo.saveWorldState(userId, validData);
  }

  async load(userId: string) {
    const save = await this.worldRepo.getWorldState(userId);

    if (!save) {
      return {...INITIAL_GAME_STATE, fixedGlitches: []};
    }

    return save;
  }
}
