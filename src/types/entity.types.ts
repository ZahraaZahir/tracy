export interface CodeToken {
  type: 'text' | 'slot' | 'keyword' | 'punctuation'; 
  content?: string;     
  id?: string;          
  currentValue?: string | null; 
}

export type CodeLine = CodeToken[];

export interface EntityResponse {
  id: string;
  isFixed: boolean;
  lines: CodeLine[];
  solutionMap: Record<string, any> | null;
  errorMessages: Record<string, any> | null;
}