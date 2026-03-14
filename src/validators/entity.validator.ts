import {z} from 'zod';

export const entityParamSchema = z.object({
  id: z.string().min(1, 'Entity ID is required'),
});
