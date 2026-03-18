import {Response} from 'express';
import {ZodError} from 'zod';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {EntityService} from '../services/entity.service.js';
import {WorldService} from '../services/world.service.js';
import {
  entityParamSchema,
  solveEntitySchema,
} from '../validators/entity.validator.js';

const entityService = new EntityService();
const worldService = new WorldService();

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = entityParamSchema.parse(req.params);
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    const result = await entityService.getEntityState(id, userId);

    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND')
      return res.status(404).json({error: 'Entity not found.'});
    res.status(500).json({error: 'Internal server error'});
  }
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = entityParamSchema.parse(req.params);
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    const {answers} = solveEntitySchema.parse(req.body);

    const result = await worldService.solve(userId, id, answers);

    return result.success
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({error: 'Invalid payload format.', details: error.message});
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({error: 'Entity not found.'});
    }

    console.error('SOLVE_ERROR:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};
