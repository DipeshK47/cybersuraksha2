export type HindiCatalogue = {
  messages: Record<string, string>;
  templates: { source: string; parts: string[]; translation: string }[];
};

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

export function createHindiTranslator(catalogue: HindiCatalogue, overrides: Record<string, string> = {}) {
  const messages = { ...catalogue.messages, ...overrides };
  const authoredTemplates = [...catalogue.templates, ...Object.keys(overrides).filter(source => source.includes('{{') && !catalogue.templates.some(template => template.source === source)).map(source => ({source, parts: [], translation: overrides[source]}))];
  const templates = authoredTemplates.map(template => {
    const source = normalize(template.source);
    const pieces = source.split(/\{\{\d+\}\}/);
    return {
      pieces,
      numericWeek: source === 'W{{0}}',
      translation: messages[source] ?? template.translation,
      prefix: pieces[0],
    };
  }).filter(template => template.pieces.slice(1, -1).every(Boolean))
    .sort((left, right) => right.prefix.length - left.prefix.length);
  const cache = new Map<string, string>();
  const phrases = new Map<string, string[]>();
  for (const message of Object.keys(messages)) {
    if (message.includes('{{') || !/[A-Za-z]/.test(message)) continue;
    const first = message[0];
    const list = phrases.get(first) ?? [];
    list.push(message); phrases.set(first, list);
  }
  for (const list of phrases.values()) list.sort((left, right) => right.length - left.length);

  function translateCore(source: string, depth = 0): string {
    if (!source || !/[A-Za-z]/.test(source)) return source;
    if (/^(?:https?:\/\/|[\w.+-]+@[\w.-]+$)/.test(source) || /^[a-z\d]+(?:[-_][a-z\d]+)+$/.test(source) || /^[A-Z\d]+(?:[-_][A-Z\d]+)+$/.test(source)) return source;
    if (/^[\w-]+(?:\.[\w-]+)+(?:\/\S*)?$/.test(source) || (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!?#@$%._-]+$/.test(source) && !/^W\d+$/.test(source)) || /^(?:sin|cos|tan|cot|sec|cosec|log|ln|sqrt)$/.test(source)) return source;
    if (Object.hasOwn(messages, source)) return messages[source];
    const counted = source.replace(/\b(Scene|Challenge|Practice|Question) (\d+) of (\d+)\b/g,
      (_, label: string, current: string, total: string) => `${total} में से ${messages[label] ?? label} ${current}`);
    if (counted !== source) return translateCore(counted, depth + 1);
    if (depth < 4) {
      for (const template of templates) {
        if (template.prefix && !source.startsWith(template.prefix)) continue;
        const captures: string[] = [];
        let cursor = template.prefix.length;
        let matched = true;
        for (let index = 1; index < template.pieces.length; index++) {
          const piece = template.pieces[index];
          const last = index === template.pieces.length - 1;
          const position = last ? source.length - piece.length : source.indexOf(piece, cursor);
          if (position < cursor || !source.startsWith(piece, position) || (last && position + piece.length !== source.length)) { matched = false; break; }
          captures.push(source.slice(cursor, position)); cursor = position + piece.length;
        }
        if (matched && (!template.numericWeek || /^\d+$/.test(captures[0]))) return template.translation.replace(/\{\{(\d+)\}\}/g, (_, index: string) => translateCore(captures[Number(index)], depth + 1));
      }
    }
    // Mixed JSX text includes numbers, names and separate inline elements. Match
    // authored fragments without rewriting IDs, code, URLs or input values.
    let output = '';
    for (let index = 0; index < source.length;) {
      const candidates = phrases.get(source[index]);
      const match = candidates?.find(phrase => source.startsWith(phrase, index) &&
        (index === 0 || !/[A-Za-z\d_]/.test(source[index - 1])) &&
        (index + phrase.length === source.length || !/[A-Za-z\d_]/.test(source[index + phrase.length])));
      if (match) { output += messages[match]; index += match.length; }
      else { output += source[index]; index++; }
    }
    return output;
  }

  return (text: string): string => {
    if (cache.has(text)) return cache.get(text)!;
    const core = normalize(text);
    const translated = translateCore(core);
    const output = translated === core ? text : (text.match(/^\s*/)?.[0] ?? '') + translated + (text.match(/\s*$/)?.[0] ?? '');
    if (cache.size > 10000) cache.clear();
    cache.set(text, output);
    return output;
  };
}
