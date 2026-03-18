import {prisma} from '../lib/prisma.js';
import {WorldService} from '../services/world.service.js';

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
        ...WorldService.DEFAULT_STATE,
        fixedGlitches: {
          connect: {id: entityId},
        },
      },
    });
  }
}
