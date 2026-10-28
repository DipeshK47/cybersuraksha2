import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {loadSource} from './class-10-helpers.mjs';
import {narrationDigest} from '../scripts/class9-assets-lib.mjs';
import {expandClass10Speech} from '../scripts/class10-assets-lib.mjs';

test('all 32 Class 10 stories have current Indian English audio and measured scene cues',async()=>{
  const {class10Chapters}=await loadSource('export {class10Chapters} from "./app/data/class10";');
  const settings=JSON.parse(await readFile(new URL('../scripts/class10-voice.json',import.meta.url),'utf8'));
  assert.equal(class10Chapters.length,32);
  assert.equal(settings.voice,'en-IN-NeerjaNeural');assert.equal(settings.rate,'+0%');
  for(const chapter of class10Chapters){
    const script=JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${chapter.slug}.json`,import.meta.url),'utf8'));
    assert.deepEqual(script.narration,settings,chapter.slug);
    assert.equal(script.scenes.length,6);
    assert.equal(script.narrationHash,narrationDigest(script.scenes,settings),chapter.slug);
    assert.ok(script.duration>60&&script.duration<200,`${chapter.slug}: measured duration`);
    let end=0;
    for(const [index,scene]of script.scenes.entries()){
      assert.equal(scene.caption,chapter.scenes[index].caption.en,chapter.slug);
      assert.equal(scene.speech,chapter.scenes[index].speech??expandClass10Speech(chapter.scenes[index].caption.en),chapter.slug);
      assert.ok(Number.isFinite(scene.start)&&scene.duration>0,chapter.slug);
      assert.ok(Math.abs(scene.start-end)<0.00001,chapter.slug);
      end=scene.start+scene.duration+settings.gapSeconds;
    }
    assert.ok(Math.abs(script.duration-end)<0.00001,chapter.slug);
    const audio=await readFile(new URL(`../public/audio/cyber/${chapter.slug}/story.mp3`,import.meta.url));
    assert.ok(audio.subarray(0,3).toString()==='ID3'||(audio[0]===255&&(audio[1]&224)===224),chapter.slug);
    assert.ok(audio.length/script.duration>15000&&audio.length/script.duration<18000,chapter.slug);
  }
});
