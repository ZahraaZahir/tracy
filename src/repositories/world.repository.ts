import {prisma} from '../lib/prisma.js';
import {SaveStateData} from '../validators/world.validator.js';
import {LogicBlock} from '../validators/inventory.validator.js';
import {Prisma} from '@prisma/client';

type SaveStateWithGlitches = Prisma.SaveStateGetPayload<{
  include: {fixedGlitches: {select: {id: true}}};
}>;

export class WorldRepository {
  async getWorldState(userId: string) {
    return await prisma.saveState.findUnique({
      where: {userId},
      include: {fixedGlitches: {select: {id: true}}},
    });
  }

  async saveWorldState(
    userId: string,
    saveStateData: SaveStateData,
    version?: number,
  ) {
    if (version !== undefined) {
      return await prisma.saveState.updateMany({
        where: {userId, version: version},
        data: {...saveStateData, version: {increment: 1}},
      });
    }
    return await prisma.saveState.update({
      where: {userId},
      data: saveStateData,
    });
  }

  async addBlockAtomic(
    userId: string,
    block: LogicBlock,
  ): Promise<LogicBlock | null> {
    return await prisma.$transaction(async (transaction) => {
      const state = await transaction.saveState.findUnique({where: {userId}});
      if (!state) return null;

      const nextInventory = [...(state.inventory as LogicBlock[]), block];

      const result = await transaction.saveState.updateMany({
        where: {userId, version: state.version},
        data: {inventory: nextInventory, version: {increment: 1}},
      });

      return result.count > 0 ? block : null;
    });
  }

  async removeBlocksAtomic(
    userId: string,
    blockIds: string[],
  ): Promise<boolean> {
    return await prisma.$transaction(async (transaction) => {
      const state = await transaction.saveState.findUnique({where: {userId}});
      if (!state) return false;

      const nextInventory = (state.inventory as LogicBlock[]).filter(
        (b) => !blockIds.includes(b.blockId),
      );

      const result = await transaction.saveState.updateMany({
        where: {userId, version: state.version},
        data: {inventory: nextInventory, version: {increment: 1}},
      });

      return result.count > 0;
    });
  }

  async completePuzzleAtomic(
    userId: string,
    entityId: string,
    blockIds: string[],
    oldVersion: number,
  ): Promise<SaveStateWithGlitches> {
    return await prisma.$transaction(async (transaction) => {
      const state = await transaction.saveState.findUnique({where: {userId}});
      if (!state) throw new Error('NOT_FOUND');

      const nextInventory = (state.inventory as LogicBlock[]).filter(
        (b) => !blockIds.includes(b.blockId),
      );

      const result = await transaction.saveState.updateMany({
        where: {userId, version: oldVersion},
        data: {inventory: nextInventory, version: {increment: 1}},
      });

      if (result.count === 0) throw new Error('VERSION_CONFLICT');

      const updatedState = await transaction.saveState.update({
        where: {userId},
        data: {fixedGlitches: {connect: {id: entityId}}},
        include: {fixedGlitches: {select: {id: true}}},
      });

      return updatedState;
    });
  }
}
