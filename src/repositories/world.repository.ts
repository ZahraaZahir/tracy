import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';
import {LogicBlock} from '../validators/inventory.validator.js';

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
    nextInventory: LogicBlock[],
    oldVersion: number,
  ): Promise<boolean> {
    const result = await prisma.saveState.updateMany({
      where: {userId, version: oldVersion},
      data: {
        inventory: nextInventory,
        version: {increment: 1},
      },
    });
    return result.count > 0;
  }

  async completePuzzleAtomic(
    userId: string,
    entityId: string,
    nextInventory: LogicBlock[],
    oldVersion: number,
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (transaction) => {
        const result = await transaction.saveState.updateMany({
          where: {userId, version: oldVersion},
          data: {
            inventory: nextInventory,
            version: {increment: 1},
          },
        });

        if (result.count === 0) throw new Error('VERSION_CONFLICT');

        await transaction.saveState.update({
          where: {userId},
          data: {fixedGlitches: {connect: {id: entityId}}},
        });
      });

      return true;
    } catch (error: any) {
      if (error.message === 'VERSION_CONFLICT') return false;
      throw error;
    }
  }
}
