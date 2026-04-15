import {EntityRepository} from '../repositories/entity.repository.js';
import {NotFoundError} from '../errors/errors.js';
import {EntityResponse} from '../types/entity.types.js';
import {tokenizeCodeTemplate} from '../lexer/lexer.js';

export class EntityService {
  private entityRepo = new EntityRepository();
  async getEntityState(
    entityId: string,
    isFixed: boolean,
  ): Promise<EntityResponse> {
    const entity = await this.entityRepo.getEntityById(entityId);

    if (!entity) {
      throw new NotFoundError(`NPC with ID ${entityId} not found.`);
    }
    const tokenizedLines = tokenizeCodeTemplate(entity.templateCode);

    return {
      id: entityId,
      isFixed,
      lines: tokenizedLines,
      solutionMap: isFixed ? (entity.solutionMap as Record<string, any>) : null,
      errorMessages: isFixed
        ? (entity.errorMessages as Record<string, any>)
        : null,
    };
  }
}
