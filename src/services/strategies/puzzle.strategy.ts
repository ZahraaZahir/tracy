import {LogicBlock} from '../../validators/inventory.validator.js';

export interface PuzzleResult {
  correct: boolean;
  wrongSlot?: string;
  message?: string;
  usedBlockIds?: string[];
}

export interface PuzzleStrategy {
  validate(
    answers: Record<string, any>,
    solutions: Record<string, any>,
    inventory: LogicBlock[],
  ): PuzzleResult;
}
