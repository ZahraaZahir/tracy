import {prisma} from '../lib/prisma.js';

export class EntityRepository {
  async getEntityById(id: string) {
    return await prisma.gameEntity.findUnique({
      where: {id},
    });
  }
  async countAllEntities() {
    return await prisma.gameEntity.count();
  }
}
