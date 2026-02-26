import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';

export class WorldRepository {
  async saveWorldState(userId: string, saveStateData: SaveStateData) {
    return await prisma.saveState.upsert({
      where: {userId},
      update: {
        data: saveStateData,
      },
      create: {
        userId,
        data: saveStateData,
      },
    });
  }

  async getWorldState(userId: string) {
    return await prisma.saveState.findUnique({
      where: {userId},
    });
  }
}
