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

  async updateSaveStateCAS(
    userId: string,
    data: any,
    oldVersion: number,
  ): Promise<boolean> {
    const result = await prisma.saveState.updateMany({
      where: {
        userId,
        version: oldVersion,
      },
      data: {
        ...data,
        version: {increment: 1},
      },
    });
    return result.count > 0;
  }

  async completePuzzleAtomic(
    userId: string,
    entityId: string,
    newInventory: any,
    oldVersion: number,
  ): Promise<boolean> {
    try {
      const [updateResult] = await prisma.$transaction([
        prisma.saveState.updateMany({
          where: {userId, version: oldVersion},
          data: {
            inventory: newInventory,
            version: {increment: 1},
          },
        }),
        prisma.saveState.update({
          where: {userId},
          data: {
            fixedGlitches: {connect: {id: entityId}},
          },
        }),
      ]);

      return updateResult.count > 0;
    } catch (error) {
      console.error('[DATABASE ERROR] Transaction failed:', error);
      return false;
    }
  }
}
