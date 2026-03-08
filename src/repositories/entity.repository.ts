import { prisma } from '../lib/prisma.js';

export class EntityRepository {
  async getEntityById(id: string) {
    return await prisma.gameEntity.findUnique({ where: { id } });
  }

  async getPlayerSave(userId: string) {
    return await prisma.saveState.findUnique({ where: { userId } });
  }
}