export type CodeToken =
  | {type: 'text'; content: string}
  | {type: 'keyword'; content: string}
  | {type: 'punctuation'; content: string}
  | {type: 'slot'; id: string; currentValue: string | null};

export type CodeLine = CodeToken[];
