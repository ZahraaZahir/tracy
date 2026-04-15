import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {EntityService} from '../services/entity.service.js';
import {WorldService} from '../services/world.service.js';
import {
  entityParamSchema,
  solveEntitySchema,
} from '../validators/entity.validator.js';

let entityService: EntityService;
let worldService: WorldService;

const getEntityService = () => {
  if (!entityService) entityService = new EntityService();
  return entityService;
};

const getWorldService = () => {
  if (!worldService) worldService = new WorldService();
  return worldService;
};

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  const {id} = entityParamSchema.parse(req.params);
  const userId = req.user!.userId;
  const isFixed = await getWorldService().isEntityFixed(userId, id);

  const result = await getEntityService().getEntityState(id, isFixed);

  res.status(200).json({message: 'Entity state retrieved', data: result});
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  const {id} = entityParamSchema.parse(req.params);
  const {answers} = solveEntitySchema.parse(req.body);
  const result = await getWorldService().solve(req.user!.userId, id, answers);

  res
    .status(result.success ? 200 : 400)
    .json({message: 'Entity state retrieved', data: result});
};
