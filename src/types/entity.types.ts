export interface CodeToken {
  type: 'text' | 'slot';
  content?: string; 
  id?: string;   
}

export type CodeLine = CodeToken[];

export interface EntityResponse {
  id: string;
  isFixed: boolean;
  lines: CodeLine[];
  solutionMap: Record<string, any> | null;
  errorMessages: Record<string, any> | null;
}