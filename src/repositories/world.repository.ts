import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';

export class WorldRepository {
  async saveWorldState(userId: string, saveStateData: SaveStateData) {
    return await prisma.saveState.update({
      where: {userId},
      data: saveStateData,
    });
  }

  async getWorldState(userId: string) {
    return await prisma.saveState.findUnique({
      where: {userId},
      include: {fixedGlitches: {select: {id: true}}},
    });
  }

  async addFixedGlitch(userId: string, entityId: string) {
    return await prisma.saveState.update({
      where: {userId},
      data: {
        fixedGlitches: {connect: {id: entityId}},
      },
    });
  }
}
