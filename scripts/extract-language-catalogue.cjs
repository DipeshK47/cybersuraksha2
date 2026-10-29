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
    !/^[a-z\d]+(?:[-_][a-z\d]+)+$/.test(text) && !/^(?:[a-z\d]+-)+$/.test(text) &&
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
        else if (value && typeof value==='object') Object.entries(value).filter(([key])=>!['narrationHash','narration','speech'].includes(key)).forEach(([,child])=>strings(child));
      }
      strings(JSON.parse(fs.readFileSync(file,'utf8'))); continue;
    }
    if (!/\.tsx?$/.test(file) || /\.generated\.ts$/.test(file)) continue;
    const source=fs.readFileSync(file,'utf8');
    const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
    const class10Content = file.startsWith(path.join('app','data','class10')+path.sep)||file.startsWith(path.join('app','module','cyber','lessons','class10')+path.sep);
    const class6Content = file.startsWith(path.join('app','data','class6')+path.sep)||file===path.join('app','module','cyber','lessons','class6','ui.ts');
    const class7Content = file.startsWith(path.join('app','data','class7')+path.sep)||file===path.join('app','module','cyber','lessons','class7','ui.ts');
    const bilingualContent = class7Content||class6Content||class10Content||['class8','class9'].some(grade=>file.startsWith(path.join('app','data',grade)+path.sep)||file===path.join('app','module','cyber','lessons',grade,'ui.ts'));
    const bilingualComposites = ['task-feedback.ts','task-evidence.ts','task-simulation.ts'].some(name=>file===path.join('app','module','cyber','lessons','class8',name));
    function visit(node) {
      if (ts.isImportDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isInterfaceDeclaration(node)) return;
      // A programming range invariant is not rendered learner-facing copy.
      if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'RangeError') return;
      // The explicit bilingual contract stores both languages and technical IDs
      // together. Only l(en, hi)'s English argument is translatable source copy.
      if (bilingualContent || bilingualComposites) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text==='l') {
          const english=node.arguments[0];
          if (english && (ts.isStringLiteral(english)||ts.isNoSubstitutionTemplateLiteral(english))) add(english.text,file);
          else if (english && !bilingualComposites && !class10Content && !class6Content && !class7Content) throw new Error(`Bilingual source must use a literal English message: ${file}`);
          return;
        }
        ts.forEachChild(node,visit); return;
      }
      if (ts.isJsxAttribute(node) && ['className','style','key','id','name','type','src','srcSet','sizes','loading','decoding','fetchPriority','href','target','rel','width','height','role','ref','data-testid','inputMode','step','transform'].includes(node.name.getText(ast))) return;
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
        if (ts.isLiteralTypeNode(p)) return;
        if (ts.isCaseClause(p) && ts.isSwitchStatement(p.parent.parent) && ts.isPropertyAccessExpression(p.parent.parent.expression) && p.parent.parent.expression.name.text==='kind') return;
        if (ts.isBinaryExpression(p) && p.right===node && ((ts.isPropertyAccessExpression(p.left) && ['kind','presentation','sceneTheme','checkRole'].includes(p.left.name.text)) || (ts.isIdentifier(p.left) && p.left.text==='theme'))) return;
        if (ts.isArrayLiteralExpression(p) && ts.isPropertyAccessExpression(p.parent) && p.parent.name.text==='includes' && ts.isCallExpression(p.parent.parent) && p.parent.parent.arguments.some(argument=>(ts.isPropertyAccessExpression(argument)&&argument.name.text==='kind')||(ts.isIdentifier(argument)&&['theme','mood'].includes(argument.text)))) return;
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
// The course compiler collects actual runtime L pairs, including authored
// diagram/helper values that cannot be recovered from a literal-only AST scan.
for(const grade of [6,7,10]) {
  const courseMessages=path.join('public','locales',`class${grade}-hi.json`);
  if(fs.existsSync(courseMessages))for(const source of Object.keys(JSON.parse(fs.readFileSync(courseMessages,'utf8'))))add(source,courseMessages);
}
fs.mkdirSync('tmp/i18n',{recursive:true});
const catalogue={messages:[...messages].sort(),templates:[...templates.values()],sources:Object.fromEntries(sources)};
fs.writeFileSync('tmp/i18n/catalogue.json',JSON.stringify(catalogue,null,2));
console.log(JSON.stringify({messages:messages.size,templates:templates.size,characters:[...messages].reduce((n,s)=>n+s.length,0)}));
