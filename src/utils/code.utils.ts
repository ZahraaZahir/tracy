import {CodeLine} from '../types/lexer.types.js';
import {SYNTAX_CONFIG} from '../config/syntax.config.js';

export const tokenizeTemplate = (template: string): CodeLine[] => {
  const lines: CodeLine[] = [];
  let currentLine: CodeLine = [];
  let buffer = '';

  const flushBuffer = () => {
    if (buffer.length === 0) return;

    const type = SYNTAX_CONFIG.keywords.includes(buffer) ? 'keyword' : 'text';

    currentLine.push({
      type: type,
      content: buffer,
    });
    buffer = '';
  };

  let i = 0;
  while (i < template.length) {
    const char = template[i];
    const nextChar = template[i + 1];

    if (char === '\n') {
      flushBuffer();
      lines.push(currentLine);
      currentLine = [];
      i++;
      continue;
    }

    if (char === '{' && nextChar === '{') {
      flushBuffer();
      i += 2;
      let rawSlot = '';
      while (
        i < template.length &&
        !(template[i] === '}' && template[i + 1] === '}')
      ) {
        rawSlot += template[i];
        i++;
      }

      const [slotId, initialValue] = rawSlot.split(':').map((s) => s.trim());
      currentLine.push({
        type: 'slot',
        id: slotId,
        currentValue: initialValue || null,
      });

      i += 2;
      continue;
    }

    if (char === ' ' || char === '\t') {
      flushBuffer();
      currentLine.push({type: 'text', content: char});
      i++;
      continue;
    }

    if (SYNTAX_CONFIG.punctuation.includes(char)) {
      flushBuffer();
      currentLine.push({type: 'punctuation', content: char});
      i++;
      continue;
    }

    buffer += char;
    i++;
  }

  flushBuffer();
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
};
