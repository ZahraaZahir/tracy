import { z } from 'zod';


export const entityCodeSchema = z.object({
  visual_mode: z.string(),
  intensity: z.number().min(0).max(1),
  color: z.string().optional(),
});

export type EntityCode = z.infer<typeof entityCodeSchema>;