import {CodeLine} from './lexer.types.js';
import {SolutionMap} from '../validators/inventory.validator.js';
import {GameEntity} from '@prisma/client';

export type ParsedGameEntity = Omit<
  GameEntity,
  'solutionMap' | 'errorMessages'
> & {
  solutionMap: SolutionMap | null;
  errorMessages: Record<string, string> | null;
};

export interface EntityResponse extends Omit<
  ParsedGameEntity,
  'templateCode' | 'createdAt' | 'updatedAt'
> {
  isFixed: boolean;
  lines: CodeLine[];
}

export type EntitySolutionMap = {
  id: string;
  solutionMap: SolutionMap;
};

