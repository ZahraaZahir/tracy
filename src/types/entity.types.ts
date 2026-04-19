import {CodeLine} from './lexer.types.js';
import {LogicBlock} from '../validators/inventory.validator.js';

export interface EntityResponse {
  id: string;
  isFixed: boolean;
  lines: CodeLine[];
  solutionMap: Record<string, LogicBlock> | null;
  errorMessages: Record<string, string> | null;
}
