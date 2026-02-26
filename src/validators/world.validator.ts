import {z} from 'zod';

export const saveStateSchema = z.object({
  posX: z.number(),
  posY: z.number(),
  mapName: z.string().min(1),
  fixedGlitches: z.array(z.string()),
  inventory: z.array(z.string()),
});

export type SaveStateData = z.infer<typeof saveStateSchema>;
