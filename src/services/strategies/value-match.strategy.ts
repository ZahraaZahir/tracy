import {LogicBlockSchema} from '../../validators/inventory.validator.js';
import {PuzzleStrategy, PuzzleResult} from './puzzle.strategy.js';

export class ValueMatchStrategy implements PuzzleStrategy {
  validate(
    answers: Record<string, any>,
    solutions: Record<string, any>,
    inventory: any[],
  ): PuzzleResult {
    const usedBlockIds: string[] = [];

    for (const slotId of Object.keys(solutions)) {
      const blockParse = LogicBlockSchema.safeParse(answers[slotId]);
      if (!blockParse.success)
        return {correct: false, wrongSlot: slotId, message: 'Invalid block'};

      const playerBlock = blockParse.data;
      if (!inventory.some((b) => b.blockId === playerBlock.blockId)) {
        return {
          correct: false,
          message: `Block ${playerBlock.blockId} not owned.`,
        };
      }

      if (
        JSON.stringify(playerBlock.value) !== JSON.stringify(solutions[slotId])
      ) {
        return {correct: false, wrongSlot: slotId, message: 'Logic mismatch'};
      }
      usedBlockIds.push(playerBlock.blockId);
    }
    return {correct: true, usedBlockIds};
  }
}
