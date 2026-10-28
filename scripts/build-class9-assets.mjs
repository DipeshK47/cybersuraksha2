/** Compile original Class 9 content and explicit Hindi pairs into local assets. */
import {build} from 'esbuild';
import ts from 'typescript';
import {readFile,writeFile,mkdtemp,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {collectMessages,canReuseNarration,expandSpeech,normalizeMessage} from './class9-assets-lib.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const subjectIndex=process.argv.indexOf('--subject');
const subject=subjectIndex<0?null:process.argv[subjectIndex+1];
const exportsBySubject={security:'class9SecurityChapters',ai:'class9AiChapters',ct:'class9CtChapters',fraud:'class9FraudChapters'};
if(subjectIndex>=0&&!Object.hasOwn(exportsBySubject,subject))throw new Error('Use --subject security, ai, ct or fraud');
const courseExport=subject?`export {${exportsBySubject[subject]} as class9Chapters} from "./app/data/class9/${subject}";`:'export {class9Chapters} from "./app/data/class9";';
const temp=await mkdtemp(join(tmpdir(),'class9-assets-'));
try {
  const output=join(temp,'content.mjs');
  await build({stdin:{contents:courseExport+'export {ui} from "./app/module/cyber/lessons/class8/ui"; export {class9Ui} from "./app/module/cyber/lessons/class9/ui";',resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:output,logLevel:'silent'});
  const {class9Chapters,ui,class9Ui}=await import(pathToFileURL(output).href);
  if(class9Chapters.length!==(subject?8:32))throw new Error('Compilation requires a complete eight-chapter subject or the full 32-chapter course');
  const settings=JSON.parse(await readFile(join(root,'scripts/class9-voice.json'),'utf8'));
  const messages=collectMessages(class9Chapters);collectMessages(ui,messages);collectMessages(class9Ui,messages);
  // Composite feedback selects both languages directly; its literal labels still
  // belong in source coverage and in the site's catalogue.
  for(const filename of ['app/module/cyber/lessons/class8/task-feedback.ts']) {
    const source=await readFile(join(root,filename),'utf8');
    const ast=ts.createSourceFile(filename,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
    function visit(node){
      if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&node.expression.text==='l') {
        const [en,hi]=node.arguments;
        if(en&&hi&&ts.isStringLiteralLike(en)&&ts.isStringLiteralLike(hi))messages[normalizeMessage(en.text)]=normalizeMessage(hi.text);
        return;
      }
      ts.forEachChild(node,visit);
    }
    visit(ast);
  }
  Object.assign(messages,{
    'Signal Studio':'सिग्नल स्टूडियो',
    'CyberShiksha Signal Studio · Class 9':'CyberShiksha सिग्नल स्टूडियो · क्लास 9',
    'Test access, connections, data use and recovery plans for a community learning desk.':'कम्युनिटी लर्निंग डेस्क के एक्सेस, कनेक्शन, डेटा के इस्तेमाल और रिकवरी प्लान जाँचें।',
    'Explore data, model errors, pixels and language through measured classroom investigations.':'क्लास में माप और जाँच करके डेटा, मॉडल की गलतियाँ, पिक्सेल और भाषा समझें।',
    'Trace variables, test conditions and records, and compare practical algorithms and route costs.':'वेरिएबल का रिकॉर्ड देखें, शर्तें और रिकॉर्ड जाँचें, फिर एल्गोरिदम और रास्तों का खर्च मिलाएँ।',
    'Check claims, payment directions and recurring permissions, and prepare useful evidence for help.':'दावे, पेमेंट की दिशा और बार-बार लागू होने वाली अनुमति जाँचें, फिर मदद के लिए काम के सबूत तैयार करें।',
    'Test systems, explain decisions and recognise pressure through 32 original chapters.':'32 नए चैप्टर में सिस्टम जाँचें, फ़ैसलों के कारण समझाएँ और दबाव पहचानें।',
  });
  const chaptersDir=join(root,'app/module/cyber/lessons/new/story/chapters');
  await mkdir(chaptersDir,{recursive:true});
  for(const chapter of class9Chapters){
    const target=join(chaptersDir,`${chapter.slug}.json`);
    let previous;try{previous=JSON.parse(await readFile(target,'utf8'));}catch{/* New chapter. */}
    const scenes=chapter.scenes.map((scene,index)=>({id:`${chapter.slug}-${index+1}`,label:ui.storyLabels[index].en,title:scene.title.en,mood:index===1?'surprise':index>=4?'happy':'thinking',caption:scene.caption.en,speech:scene.speech??expandSpeech(scene.caption.en),dialogue:scene.dialogue.en,status:class9Ui.lab.en,tone:index===1?'trouble':index>=4?'resolved':'normal',start:0,duration:0}));
    const reuse=canReuseNarration(previous,scenes,settings);
    if(reuse)scenes.forEach((scene,index)=>{scene.start=previous.scenes[index].start;scene.duration=previous.scenes[index].duration;});
    const script={duration:reuse?previous.duration:0,narration:settings,...(reuse?{narrationHash:previous.narrationHash}:{}),scenes};
    if(!process.argv.includes('--locales-only')){
      await writeFile(target,JSON.stringify(script,null,2)+'\n');
      const wrapper=`// Generated from authored Class 9 content by scripts/build-class9-assets.mjs.\nimport {getClass9Chapter} from "../../../../../../data/class9";\nimport {createClass9Story} from "../../../class9/Class9Stories";\nimport script from "./${chapter.slug}.json";\nexport default createClass9Story(getClass9Chapter(${JSON.stringify(chapter.slug)})!,script);\n`;
      await writeFile(join(chaptersDir,`${chapter.slug}.tsx`),wrapper);
    }
    messages[`${chapter.title.en} complete`]=`${chapter.title.hi} पूरा हुआ`;
    messages[`You solved three practice challenges in ${chapter.title.en}.`]=`आपने ${chapter.title.hi} में तीन प्रैक्टिस चैलेंज हल किए।`;
  }
  const generated=join(root,'public/locales/class9-hi.json');
  let old={};try{old=JSON.parse(await readFile(generated,'utf8'));}catch{/* First authored edition. */}
  const path=join(root,'public/locales/hi.json');
  const catalogue=JSON.parse(await readFile(path,'utf8'));
  for(const [source,translation] of Object.entries(messages)){
    if(!(source in catalogue.messages)||catalogue.messages[source]===old[source])catalogue.messages[source]=translation;
    if(source.includes('{{')&&!catalogue.templates.some(t=>t.source===source))catalogue.templates.push({source,parts:[],translation});
  }
  // Retain ownership across incremental subject builds so later editorial fixes
  // can update this course's entries without replacing reviewed older copy.
  await writeFile(generated,JSON.stringify({...old,...messages},null,2)+'\n');
  await writeFile(path,JSON.stringify(catalogue,null,2)+'\n');
  console.log(`Compiled ${class9Chapters.length} Class 9 chapters and ${Object.keys(messages).length} authored Hindi messages; matching measured narration retained.`);
}finally{await rm(temp,{recursive:true,force:true});}
