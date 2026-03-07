import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js'; 
import { EntityService } from '../services/entity.service.js';

const entityService = new EntityService();

export const getEntity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string; 
    
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await entityService.getEntityState(id, userId);
    res.status(200).json(result);


  } catch (error: any) {
    if (error.message === 'ENTITY_NOT_FOUND') {
      return res.status(404).json({ error: 'Object not found in world.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};