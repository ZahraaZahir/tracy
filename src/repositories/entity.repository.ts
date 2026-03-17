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
}
