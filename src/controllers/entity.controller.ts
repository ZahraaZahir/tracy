import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {EntityService} from '../services/entity.service.js';
import {WorldService} from '../services/world.service.js';
import {PuzzleService} from '../services/puzzle.service.js';
import {ValueMatchStrategy} from '../services/strategies/value-match.strategy.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {WorldRepository} from '../repositories/world.repository.js';
import {
  entityParamSchema,
  solveEntitySchema,
} from '../validators/entity.validator.js';

const worldRepo = new WorldRepository();
const entityRepo = new EntityRepository();
const entityService = new EntityService(entityRepo);
const worldService = new WorldService(worldRepo, entityRepo);
const puzzleService = new PuzzleService(
  entityRepo,
  worldRepo,
  new ValueMatchStrategy(),
);

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  const {id} = entityParamSchema.parse(req.params);
  const userId = req.user!.userId;

  const playerState = await worldService.load(userId);
  const isFixed = playerState.fixedGlitches.includes(id);

  const entityData = await entityService.getEntityState(id, isFixed);

  res.status(200).json({
    message: 'Entity state retrieved',
    data: {
      ...entityData,
      inventory: playerState.inventory || [],
    },
  });
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  const {id} = entityParamSchema.parse(req.params);
  const {answers} = solveEntitySchema.parse(req.body);
  const result = await puzzleService.solve(req.user!.userId, id, answers);

  res.status(result.success ? 200 : 400).json({data: result});
};
