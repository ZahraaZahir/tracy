import {prisma} from '../lib/prisma.js';

export class EntityRepository {
  async getEntityById(id: string) {
    return await prisma.gameEntity.findUnique({
      where: {id},
    });
  }

  async isFixed(userId: string, entityId: string): Promise<boolean> {
    const save = await prisma.saveState.findFirst({
      where: {
        userId: userId,
        fixedGlitches: {
          some: {id: entityId},
        },
      },
    });
    return !!save;
  }

  async markAsFixed(userId: string, entityId: string) {
    return await prisma.saveState.upsert({
      where: {userId},
      update: {
        fixedGlitches: {
          connect: {id: entityId},
        },
      },
      create: {
        userId,
        posX: 0,
        posY: 0,
        mapName: 'main_world',
        fixedGlitches: {
          connect: {id: entityId},
        },
      },
    });
  }
}
