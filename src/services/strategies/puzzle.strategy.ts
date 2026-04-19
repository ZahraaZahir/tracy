import {LogicBlock} from '../../validators/inventory.validator.js';

export type PuzzleResult =
  | {correct: true; usedBlockIds: string[]}
  | {correct: false; wrongSlot: string; message: string};

export interface PuzzleStrategy {
  validate(
    answers: Record<string, LogicBlock>,
    solutions: Record<string, LogicBlock>,
    inventory: LogicBlock[],
  ): PuzzleResult;
}
