import {z} from 'zod';
import {LogicBlockSchema} from './inventory.validator.js';

export const entityParamSchema = z.object({
  id: z.string().min(1, 'Entity ID is required'),
});

export const solveEntitySchema = z.object({
  answers: z.record(z.string(), LogicBlockSchema),
});
