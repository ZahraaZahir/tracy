import {
  LogicBlockSchema,
  LogicBlock,
} from '../../validators/inventory.validator.js';
import {PuzzleStrategy, PuzzleResult} from './puzzle.strategy.js';

export class ValueMatchStrategy implements PuzzleStrategy {
  validate(
    answers: Record<string, LogicBlock>,
    solutions: Record<string, LogicBlock>,
    inventory: LogicBlock[],
  ): PuzzleResult {
    const usedBlockIds: string[] = [];
    const availableInventory = [...inventory];

    for (const slotId of Object.keys(solutions)) {
      const blockParse = LogicBlockSchema.safeParse(answers[slotId]);
      if (!blockParse.success)
        return {correct: false, wrongSlot: slotId, message: 'Invalid block'};

      const playerBlock = blockParse.data;

      const inventoryIndex = availableInventory.findIndex(
        (b) => b.blockId === playerBlock.blockId,
      );

      if (inventoryIndex === -1) {
        return {
          correct: false,
          wrongSlot: slotId,
          message: `Block ${playerBlock.blockId} not owned or already used.`,
        };
      }

      const actualBlock = availableInventory.splice(inventoryIndex, 1)[0];

      if (
        JSON.stringify(actualBlock.value) !==
        JSON.stringify(solutions[slotId].value)
      ) {
        return {correct: false, wrongSlot: slotId, message: 'Logic mismatch'};
      }

      usedBlockIds.push(actualBlock.blockId);
    }

    return {correct: true, usedBlockIds};
  }
}
