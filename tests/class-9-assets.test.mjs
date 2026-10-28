import assert from 'node:assert/strict';
import test from 'node:test';
import {narrationDigest,canReuseNarration,collectMessages} from '../scripts/class9-assets-lib.mjs';

const settings={voice:'en-IN-NeerjaNeural',rate:'+0%',gapSeconds:0.65};
const scenes=Array.from({length:6},(_,i)=>({caption:`Scene ${i}`,speech:`Spoken scene ${i}`}));
const previous={duration:60,narrationHash:narrationDigest(scenes,settings),scenes:scenes.map((s,i)=>({...s,start:i*10,duration:9.35}))};
test('measured cues survive only matching captions, speech and voice settings',()=>{
  assert.equal(canReuseNarration(previous,scenes,settings),true);
  assert.equal(canReuseNarration(previous,scenes,{...settings,voice:'en-IN-PrabhatNeural'}),false);
  assert.equal(canReuseNarration(previous,scenes,{...settings,rate:'-8%'}),false);
  assert.equal(canReuseNarration(previous,scenes.map((s,i)=>i===2?{...s,speech:'Changed spoken content'}:s),settings),false);
  assert.equal(canReuseNarration(previous,scenes.map((s,i)=>i===2?{...s,caption:'Changed visible content'}:s),settings),false);
  assert.equal(canReuseNarration({...previous,duration:0},scenes,settings),false);
});
test('voice-sensitive digest is deterministic and authored Hindi collection ignores IDs',()=>{
  assert.equal(narrationDigest(scenes,settings),narrationDigest(structuredClone(scenes),structuredClone(settings)));
  assert.notEqual(narrationDigest(scenes,settings),narrationDigest(scenes,{...settings,gapSeconds:0.8}));
  assert.deepEqual(collectMessages({id:'class9-unchanged',topic:{en:'Check 3 rows',hi:'3 पंक्तियाँ जाँचें'},tasks:[{prompt:{en:'Try again',hi:'फिर आज़माएँ'}}]}),{'Check 3 rows':'3 पंक्तियाँ जाँचें','Try again':'फिर आज़माएँ'});
});
