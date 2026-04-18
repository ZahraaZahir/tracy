import {CodeLine} from '../types/lexer.types.js';
import {SYNTAX_CONFIG} from '../config/syntax.config.js';

export const tokenizeCodeTemplate = (template: string): CodeLine[] => {
  const lines: CodeLine[] = [];
  let currentLine: CodeLine = [];
  let buffer = '';

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    const type = SYNTAX_CONFIG.keywords.includes(buffer) ? 'keyword' : 'text';
    currentLine.push({type, content: buffer});
    buffer = '';
  };

  let i = 0;
  while (i < template.length) {
    const char = template[i];

    if (char === '\n') {
      flushBuffer();
      lines.push(currentLine);
      currentLine = [];
      i++;
      continue;
    }

    if (template.slice(i, i + 2) === '{{') {
      flushBuffer();
      const endIndex = template.indexOf('}}', i + 2);
      if (endIndex === -1) throw new Error('Unclosed slot in template');

      const rawSlot = template.slice(i + 2, endIndex);
      const [slotId, initialValue] = rawSlot.split(':').map((s) => s.trim());

      currentLine.push({
        type: 'slot',
        id: slotId,
        currentValue: initialValue || null,
      });

      i = endIndex + 2;
      continue;
    }

    if (SYNTAX_CONFIG.delimiters.includes(char)) {
      flushBuffer();
      if (char !== ' ' && char !== '\t') {
        currentLine.push({type: 'punctuation', content: char});
      } else {
        currentLine.push({type: 'text', content: char});
      }
      i++;
      continue;
    }

    buffer += char;
    i++;
  }

  flushBuffer();
  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
};
