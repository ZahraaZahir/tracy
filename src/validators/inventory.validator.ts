import {z} from 'zod';

export const LogicBlockSchema = z.object({
  blockId: z.uuid(),
  type: z.enum(['bool', 'int', 'string', 'float']),
  value: z.union([z.boolean(), z.string(), z.number()]),
});

export const InventorySchema = z.array(LogicBlockSchema);

export type LogicBlock = z.infer<typeof LogicBlockSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
