import {z} from 'zod';

export const LogicBlockSchema = z.discriminatedUnion('type', [
  z.object({
    blockId: z.uuid(),
    type: z.literal('boolean'),
    value: z.boolean(),
  }),
  z.object({
    blockId: z.uuid(),
    type: z.literal('int'),
    value: z.number().int(),
  }),
  z.object({
    blockId: z.uuid(),
    type: z.literal('float'),
    value: z.number(),
  }),
  z.object({
    blockId: z.uuid(),
    type: z.literal('string'),
    value: z.string(),
  }),
]);

export const InventorySchema = z.array(LogicBlockSchema);

export type LogicBlock = z.infer<typeof LogicBlockSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
