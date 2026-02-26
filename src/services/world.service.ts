import {WorldRepository} from '../repositories/world.repository.js';
import {saveStateSchema} from '../validators/world.validator.js';

export class WorldService {
  private worldRepo = new WorldRepository();

  async save(userId: string, rawData: any) {
    const validData = saveStateSchema.parse(rawData);
    return await this.worldRepo.saveWorldState(userId, validData);
  }

  async load(userId: string) {
    const saveState = await this.worldRepo.getWorldState(userId);
    if (!saveState) {
      return {
        posX: 0,
        posY: 0,
        mapName: 'main-world',
        fixedGlitches: [],
        inventory: [],
      };
    }
    return saveState.data;
  }
}
