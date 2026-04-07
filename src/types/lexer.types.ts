export type TokenType = 'text' | 'slot' | 'keyword' | 'punctuation';

export interface CodeToken {
  type: TokenType;
  content?: string;
  id?: string;
  currentValue?: string | null;
}

export type CodeLine = CodeToken[];
