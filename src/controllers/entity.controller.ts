import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { EntityService } from '../services/entity.service.js';
import { WorldService } from '../services/world.service.js';
import { entityParamSchema, solveEntitySchema } from '../validators/entity.validator.js';

const entityService = new EntityService();
const worldService = new WorldService();

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = entityParamSchema.parse(req.params);
  const userId = req.user!.userId;
  const isFixed = await worldService.isEntityFixed(userId, id);
  const result = await entityService.getEntityState(id, isFixed);
  res.status(200).json(result);
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = entityParamSchema.parse(req.params);
  const { answers } = solveEntitySchema.parse(req.body);
  const result = await worldService.solve(req.user!.userId, id, answers);
  res.status(result.success ? 200 : 400).json(result);
};