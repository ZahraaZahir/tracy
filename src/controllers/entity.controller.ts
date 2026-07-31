import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { EntityService } from '../services/entity.service.js';
import { WorldService } from '../services/world.service.js';
import { PuzzleService } from '../services/puzzle.service.js';
import { LeaderboardRepository } from '../repositories/leaderboard.repository.js';
import { ValueMatchStrategy } from '../services/strategies/value-match.strategy.js';
import { EntityRepository } from '../repositories/entity.repository.js';
import { WorldRepository } from '../repositories/world.repository.js';
import { entityParamSchema, solveEntitySchema } from '../validators/entity.validator.js';

let entityService: EntityService;
let worldService: WorldService;
let puzzleService: PuzzleService;
const lbRepo = new LeaderboardRepository();

const initServices = () => {
  if (!worldService) {
    const worldRepo = new WorldRepository();
    const entityRepo = new EntityRepository();
    entityService = new EntityService(entityRepo);
    worldService = new WorldService(worldRepo, entityRepo);
    puzzleService = new PuzzleService(entityRepo, worldRepo, new ValueMatchStrategy());
  }
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  initServices();
  const { id } = entityParamSchema.parse(req.params);
  const { answers } = solveEntitySchema.parse(req.body);
  const { sub, username } = req.user!; 

  const result = await puzzleService.solve(sub, id, answers);

  if (result.success && typeof result.fixedCount === 'number') {
    await lbRepo.syncAndPlus(sub, username, result.fixedCount);
  }

  res.status(result.success ? 200 : 400).json(result);
};

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  initServices();
  const { id } = entityParamSchema.parse(req.params);
  const state = await worldService.load(req.user!.sub);
  const entityData = await entityService.getEntityState(id, state.fixedGlitches.includes(id));

  res.status(200).json({ data: { ...entityData, inventory: state.inventory } });
};