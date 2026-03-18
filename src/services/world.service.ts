import {WorldRepository} from '../repositories/world.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';

export class WorldService {
  private worldRepo = new WorldRepository();

  public static readonly DEFAULT_STATE = {
    posX: 0,
    posY: 0,
    mapName: 'main_world',
  };

  async save(userId: string, rawData: any) {
    const validData = saveStateSchema.parse(rawData);
    return await this.worldRepo.saveWorldState(userId, validData);
  }

  async load(userId: string) {
    const saveState = await this.worldRepo.getWorldState(userId);

    if (!saveState) {
      return {
        ...WorldService.DEFAULT_STATE,
        fixedGlitches: [],
      };
    }

    const fixedIds = saveState.fixedGlitches.map((glitch) => glitch.id);

    return {
      posX: saveState.posX,
      posY: saveState.posY,
      mapName: saveState.mapName,
      fixedGlitches: fixedIds,
    };
  }
}
