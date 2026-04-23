import {prisma} from '../lib/prisma.js';
import {SolutionMapSchema} from '../validators/inventory.validator.js';
import {ParsedGameEntity, EntitySolutionMap} from '../types/entity.types.js';
import {z} from 'zod';

const ErrorMessagesSchema = z.record(z.string(), z.string());

export class EntityRepository {
  async getEntityById(id: string): Promise<ParsedGameEntity | null> {
    const entity = await prisma.gameEntity.findUnique({where: {id}});
    if (!entity) return null;

    return {
      ...entity,
      solutionMap: entity.solutionMap
        ? SolutionMapSchema.parse(entity.solutionMap)
        : null,
      errorMessages: entity.errorMessages
        ? ErrorMessagesSchema.parse(entity.errorMessages)
        : null,
    };
  }

  async countAllEntities() {
    return await prisma.gameEntity.count();
  }

  async getAllSolutionMaps(): Promise<EntitySolutionMap[]> {
    const entities = await prisma.gameEntity.findMany({
      select: {id: true, solutionMap: true},
    });

    return entities
      .filter((e) => e.solutionMap !== null)
      .map((e) => ({
        id: e.id,
        solutionMap: SolutionMapSchema.parse(e.solutionMap),
      }));
  }
}
