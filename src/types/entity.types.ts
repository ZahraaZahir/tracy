import {CodeLine} from './lexer.types.js';

export interface EntityResponse {
  id: string;
  isFixed: boolean;
  lines: CodeLine[];
  solutionMap: Record<string, any> | null;
  errorMessages: Record<string, any> | null;
}
