import { CodeLine } from '../types/entity.types.js';

export const tokenizeTemplate = (template: string): CodeLine[] => {
  const lines: CodeLine[] = [];
  let currentLine: CodeLine = [];
  let accumulator = "";
  
  let i = 0;
  while (i < template.length) {
    const char = template[i];
    const nextChar = template[i + 1];

    if (char === '\n') {
      if (accumulator.length > 0) {
        currentLine.push({ type: 'text', content: accumulator });
        accumulator = "";
      }
      lines.push(currentLine);
      currentLine = [];
      i++;
      continue;
    }

    if (char === '{' && nextChar === '{') {
      if (accumulator.length > 0) {
        currentLine.push({ type: 'text', content: accumulator });
        accumulator = "";
      }

      i += 2;
      let rawSlot = "";
      while (i < template.length && !(template[i] === '}' && template[i+1] === '}')) {
        rawSlot += template[i];
        i++;
      }
      
      const slotParts = rawSlot.split(':');
      const slotId = slotParts[0].trim();
      const initialValue = slotParts.length > 1 ? slotParts.slice(1).join(':').trim() : null;

      currentLine.push({ 
        type: 'slot', 
        id: slotId, 
        currentValue: initialValue 
      });

      i += 2;
      continue;
    }    
    accumulator += char;
    i++;
  }
  
  if (accumulator.length > 0) {
    currentLine.push({ type: 'text', content: accumulator });
  }
  if (currentLine.length > 0 || lines.length === 0) {
    lines.push(currentLine);
  }

  return lines;
};