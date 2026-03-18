import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';

export class WorldRepository {
  async saveWorldState(userId: string, saveStateData: SaveStateData) {
    const {posX, posY, mapName} = saveStateData;

    return await prisma.saveState.upsert({
      where: {userId},
      update: {posX, posY, mapName},
      create: {
        userId,
        posX,
        posY,
        mapName,
      },
    });
  }

  async getWorldState(userId: string) {
    return await prisma.saveState.findUnique({
      where: {userId},
      include: {fixedGlitches: true},
    });
  }
}
