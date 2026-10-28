/** Shared compiler for authored bilingual secondary-school courses. */
import {build} from 'esbuild';
import ts from 'typescript';
import {readFile,writeFile,mkdtemp,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {collectMessages,canReuseNarration,expandSpeech,normalizeMessage,mergeOwnedMessages} from './class9-assets-lib.mjs';

export async function compileStructuredCourse({grade,manualMessages={},speech=expandSpeech}) {
  if(![9,10].includes(grade))throw new RangeError('This compiler supports Classes 9 and 10');
  const root=fileURLToPath(new URL('../',import.meta.url));
  const subjectIndex=process.argv.indexOf('--subject');
  const subject=subjectIndex<0?null:process.argv[subjectIndex+1];
  const names={security:'Security',ai:'Ai',ct:'Ct',fraud:'Fraud'};
  if(subjectIndex>=0&&!Object.hasOwn(names,subject))throw new Error('Use --subject security, ai, ct or fraud');
  const courseExport=subject?`export {class${grade}${names[subject]}Chapters as chapters} from "./app/data/class${grade}/${subject}";`:`export {class${grade}Chapters as chapters} from "./app/data/class${grade}";`;
  const temp=await mkdtemp(join(tmpdir(),`class${grade}-assets-`));
  try {
    const output=join(temp,'content.mjs');
    await build({stdin:{contents:courseExport+`export {ui} from "./app/module/cyber/lessons/class8/ui"; export {class${grade}Ui as courseUi} from "./app/module/cyber/lessons/class${grade}/ui";`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:output,logLevel:'silent'});
    const {chapters,ui,courseUi}=await import(pathToFileURL(output).href);
    if(chapters.length!==(subject?8:32))throw new Error('Compilation requires a complete eight-chapter subject or the full 32-chapter course');
    const settings=JSON.parse(await readFile(join(root,`scripts/class${grade}-voice.json`),'utf8'));
    const messages=collectMessages(chapters);collectMessages(ui,messages);collectMessages(courseUi,messages);
    const copyFiles=['app/module/cyber/lessons/class8/task-feedback.ts'];
    if(grade===10)copyFiles.push(...(subject?[subject]:Object.keys(names)).map(name=>`app/data/class10/${name}.ts`));
    function visit(node) {
      if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&node.expression.text==='l') {
        const [en,hi]=node.arguments;
        if(en&&hi&&ts.isStringLiteralLike(en)&&ts.isStringLiteralLike(hi))messages[normalizeMessage(en.text)]=normalizeMessage(hi.text);
        return;
      }
      ts.forEachChild(node,visit);
    }
    // Keep literal editorial pairs covered too: authored frame construction can
    // replace an earlier value that still appears in the source catalogue.
    for(const file of copyFiles)visit(ts.createSourceFile(file,await readFile(join(root,file),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS));
    Object.assign(messages,manualMessages);
    const chaptersDir=join(root,'app/module/cyber/lessons/new/story/chapters');
    await mkdir(chaptersDir,{recursive:true});
    for(const chapter of chapters) {
      const target=join(chaptersDir,`${chapter.slug}.json`);
      let previous;try{previous=JSON.parse(await readFile(target,'utf8'));}catch{/* New chapter. */}
      const scenes=chapter.scenes.map((scene,index)=>({id:`${chapter.slug}-${index+1}`,label:ui.storyLabels[index].en,title:scene.title.en,mood:index===1?'surprise':index>=4?'happy':'thinking',caption:scene.caption.en,speech:scene.speech??speech(scene.caption.en),dialogue:scene.dialogue.en,status:courseUi.lab.en,tone:index===1?'trouble':index>=4?'resolved':'normal',start:0,duration:0}));
      const reuse=canReuseNarration(previous,scenes,settings);
      if(reuse)scenes.forEach((scene,index)=>{scene.start=previous.scenes[index].start;scene.duration=previous.scenes[index].duration;});
      const script={duration:reuse?previous.duration:0,narration:settings,...(reuse?{narrationHash:previous.narrationHash}:{}),scenes};
      if(!process.argv.includes('--locales-only')) {
        await writeFile(target,JSON.stringify(script,null,2)+'\n');
        const wrapper=`// Generated from authored Class ${grade} content by scripts/build-class${grade}-assets.mjs.\nimport {getClass${grade}Chapter} from "../../../../../../data/class${grade}";\nimport {createClass${grade}Story} from "../../../class${grade}/Class${grade}Stories";\nimport script from "./${chapter.slug}.json";\nexport default createClass${grade}Story(getClass${grade}Chapter(${JSON.stringify(chapter.slug)})!,script);\n`;
        await writeFile(join(chaptersDir,`${chapter.slug}.tsx`),wrapper);
      }
      messages[`${chapter.title.en} complete`]=`${chapter.title.hi} पूरा हुआ`;
      messages[`You solved three practice challenges in ${chapter.title.en}.`]=`आपने ${chapter.title.hi} में तीन प्रैक्टिस चैलेंज हल किए।`;
    }
    const generated=join(root,`public/locales/class${grade}-hi.json`);
    let old={};try{old=JSON.parse(await readFile(generated,'utf8'));}catch{/* New course. */}
    const cataloguePath=join(root,'public/locales/hi.json');
    const catalogue=JSON.parse(await readFile(cataloguePath,'utf8'));
    const merged=mergeOwnedMessages(catalogue.messages,old,messages);catalogue.messages=merged.messages;
    for(const source of Object.keys(messages))if(source.includes('{{')&&!catalogue.templates.some(t=>t.source===source))catalogue.templates.push({source,parts:[],translation:catalogue.messages[source]});
    await writeFile(generated,JSON.stringify(merged.owned,null,2)+'\n');
    await writeFile(cataloguePath,JSON.stringify(catalogue,null,2)+'\n');
    console.log(`Compiled ${chapters.length} Class ${grade} chapters and ${Object.keys(messages).length} authored Hindi messages; matching measured narration retained.`);
  }finally{await rm(temp,{recursive:true,force:true});}
}
