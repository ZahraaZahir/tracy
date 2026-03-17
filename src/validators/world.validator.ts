import {z} from 'zod';

export const saveStateSchema = z.object({
  posX: z.number(),
  posY: z.number(),
  mapName: z.string().min(1),
});

export type SaveStateData = z.infer<typeof saveStateSchema>;
