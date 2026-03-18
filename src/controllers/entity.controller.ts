import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {EntityService} from '../services/entity.service.js';
import {
  entityParamSchema,
  solveEntitySchema,
} from '../validators/entity.validator.js';

const entityService = new EntityService();

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = entityParamSchema.parse(req.params);
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    const result = await entityService.getEntityState(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({error: 'Entity not found in library.'});
    }
    res.status(500).json({error: 'Internal server error'});
  }
};

export const solveEntity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = entityParamSchema.parse(req.params);
    const userId = req.user?.userId;
    const {answers} = solveEntitySchema.parse(req.body);

    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    const result = await entityService.solveEntity(id, userId, answers);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({error: 'Entity not found.'});
    }
    console.error('SOLVE_ERROR:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};
