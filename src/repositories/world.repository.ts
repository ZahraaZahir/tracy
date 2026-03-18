import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';
import {INITIAL_GAME_STATE} from '../config/game.config.js';

export class WorldRepository {
  async saveWorldState(userId: string, saveStateData: SaveStateData) {
    return await prisma.saveState.upsert({
      where: {userId},
      update: saveStateData,
      create: {userId, ...saveStateData},
    });
  }

  async getWorldState(userId: string) {
    const save = await prisma.saveState.findUnique({
      where: {userId},
      include: {fixedGlitches: {select: {id: true}}},
    });

    if (!save) return null;

    return {
      posX: save.posX,
      posY: save.posY,
      mapName: save.mapName,
      fixedGlitches: save.fixedGlitches.map((g) => g.id),
    };
  }

  async addFixedGlitch(userId: string, entityId: string) {
    return await prisma.saveState.upsert({
      where: {userId},
      update: {
        fixedGlitches: {connect: {id: entityId}},
      },
      create: {
        userId,
        ...INITIAL_GAME_STATE,
        fixedGlitches: {connect: {id: entityId}},
      },
    });
  }
}
