import {prisma} from '../lib/prisma.js';
import {
  SolutionMapSchema,
  SolutionValue,
} from '../validators/inventory.validator.js';

export class EntityRepository {
  async getEntityById(id: string) {
    return await prisma.gameEntity.findUnique({
      where: {id},
    });
  }

  async countAllEntities() {
    return await prisma.gameEntity.count();
  }

  async getAllSolutionMaps(): Promise<
    Array<{solutionMap: Record<string, SolutionValue>}>
  > {
    const entities = await prisma.gameEntity.findMany({
      select: {solutionMap: true},
    });
    return entities.map((e) => ({
      solutionMap: SolutionMapSchema.parse(e.solutionMap),
    }));
  }
}
