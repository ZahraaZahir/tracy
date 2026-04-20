import {z} from 'zod';

export const SolutionValueSchema = z.discriminatedUnion('type', [
  z.object({type: z.literal('boolean'), value: z.boolean()}),
  z.object({type: z.literal('int'), value: z.number().int()}),
  z.object({type: z.literal('float'), value: z.number()}),
  z.object({type: z.literal('string'), value: z.string()}),
]);

export const SolutionMapSchema = z.record(z.string(), SolutionValueSchema);

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

export type SolutionValue = z.infer<typeof SolutionValueSchema>;
export type SolutionMap = z.infer<typeof SolutionMapSchema>;

export type LogicBlock = z.infer<typeof LogicBlockSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
