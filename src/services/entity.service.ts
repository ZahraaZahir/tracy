import {EntityRepository} from '../repositories/entity.repository.js';
import {NotFoundError} from '../errors/errors.js';
import {EntityResponse} from '../types/entity.types.js';
import {tokenizeCodeTemplate} from '../lexer/lexer.js';

export class EntityService {
  constructor(private entityRepo: EntityRepository) {}

  async getEntityState(
    entityId: string,
    isFixed: boolean,
  ): Promise<EntityResponse> {
    const entity = await this.entityRepo.getEntityById(entityId);

    if (!entity) {
      throw new NotFoundError(`NPC with ID ${entityId} not found.`);
    }

    return {
      id: entityId,
      isFixed,
      lines: tokenizeCodeTemplate(entity.templateCode),
      solutionMap: isFixed ? entity.solutionMap : null,
      errorMessages: isFixed ? entity.errorMessages : null,
    };
  }
}
