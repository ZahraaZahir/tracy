import {Response} from 'express';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {WorldService} from '../services/world.service.js';
import {ZodError} from 'zod';

const worldService = new WorldService();

export const saveState = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({error: 'User missing'});
    }
    const result = await worldService.save(userId, req.body);
    res
      .status(200)
      .json({message: 'World state saved successfully', data: result});
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid save data format.',
        details: error.message,
      });
    }
    console.error('Save error: ', error);
    res.status(500).json({error: 'Internal server error.'});
  }
};

export const loadState = async (req: AuthenticatedRequest, res: Response) => {};
