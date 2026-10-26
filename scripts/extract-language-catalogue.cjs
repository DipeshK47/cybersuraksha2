// Refresh after changing learner-facing copy: node scripts/extract-language-catalogue.cjs
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const messages = new Set();
const templates = new Map();
const sources = new Map();
function human(text) {
  return /[a-zA-Z]{2}/.test(text) && text.length < 20000 &&
    !/^(?:https?:|\/|\.|#[\w-]+$|--|[\w.-]+@[\w.-]+$)/.test(text) &&
    !/^[a-z\d]+(?:[-_][a-z\d]+)+$/.test(text) &&
    !/^(?:var\(|url\(|rgba?\(|hsl\(|oklch\(|@|[A-Za-z_$]+\.[A-Za-z_$]+\()/.test(text);
}
function add(text, source) {
  text = text.replace(/\s+/g, ' ').trim();
  if (!human(text)) return;
  messages.add(text);
  if (!sources.has(text)) sources.set(text, source);
}
function decode(text) { return text.replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, value => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '})[value]); }
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'i18n') walk(file); continue; }
    if (file.endsWith('/handbook-hi.json')) continue;
    if (file.endsWith('.json')) {
      function strings(value) {
        if (typeof value === 'string') add(value,file);
        else if (Array.isArray(value)) value.forEach(strings);
        else if (value && typeof value==='object') Object.values(value).forEach(strings);
      }
      strings(JSON.parse(fs.readFileSync(file,'utf8'))); continue;
    }
    if (!/\.tsx?$/.test(file) || /\.generated\.ts$/.test(file)) continue;
    const source=fs.readFileSync(file,'utf8');
    const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
    function visit(node) {
      if (ts.isImportDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isInterfaceDeclaration(node)) return;
      if (ts.isJsxAttribute(node) && ['className','style','key','id','name','type','src','href','target','rel','width','height','role','ref','data-testid'].includes(node.name.getText(ast))) return;
      if (ts.isTemplateExpression(node)) {
        const parts=[node.head.text,...node.templateSpans.map(span=>span.literal.text)];
        const text=parts.map((part,index)=>part+(index<parts.length-1?`{{${index}}}`:'')).join('').replace(/\s+/g,' ').trim();
        if (human(text) && parts.some(part=>/[A-Za-z]{2}\s|\s[A-Za-z]{2}/.test(part))) {
          templates.set(text,{source:text,parts:parts.map(part=>part.replace(/\s+/g,' ')),file});
          add(text,file);
        }
        node.templateSpans.forEach(span=>visit(span.expression)); return;
      }
      if (ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)) {
        const p=node.parent;
        if ((ts.isPropertyAssignment(p)&&p.name===node)||(ts.isElementAccessExpression(p)&&p.argumentExpression===node)) return;
        if (node.text!=='use client') add(node.text,file);
        return;
      }
      if (ts.isJsxText(node)) { add(decode(node.text),file); return; }
      ts.forEachChild(node,visit);
    }
    visit(ast);
  }
}
walk('app'); walk('db');
fs.mkdirSync('tmp/i18n',{recursive:true});
const catalogue={messages:[...messages].sort(),templates:[...templates.values()],sources:Object.fromEntries(sources)};
fs.writeFileSync('tmp/i18n/catalogue.json',JSON.stringify(catalogue,null,2));
console.log(JSON.stringify({messages:messages.size,templates:templates.size,characters:[...messages].reduce((n,s)=>n+s.length,0)}));
