import {
  LogicBlock,
  SolutionValue,
} from '../../validators/inventory.validator.js';

export type PuzzleResult =
  | {correct: true; usedBlockIds: string[]}
  | {correct: false; wrongSlot: string; message: string};

export interface PuzzleStrategy {
  validate(
    answers: Record<string, LogicBlock>,
    solutions: Record<string, SolutionValue>,
    inventory: LogicBlock[],
  ): PuzzleResult;
}
