import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import * as shared from '../scripts/class9-assets-lib.mjs';

test('Class 10 speech expands technical acronyms without changing visible source text',async()=>{
  const helper=new URL('../scripts/class10-assets-lib.mjs',import.meta.url);
  assert.ok(existsSync(helper),'Class 10 speech preparation is required');
  const {expandClass10Speech}=await import(helper.href);
  const caption='Aditi and Vihaan read AI, TP, FP, FN, TN, NLP, CNN, RGB and F1.';
  assert.equal(expandClass10Speech(caption),'Aditi and Vihaan read A I, T P, F P, F N, T N, N L P, C N N, R G B and F one.');
  assert.equal(caption,'Aditi and Vihaan read AI, TP, FP, FN, TN, NLP, CNN, RGB and F1.');
});

test('course catalogue ownership preserves pre-existing translations on later edits',()=>{
  assert.equal(typeof shared.mergeOwnedMessages,'function','Owned catalogue merging is required');
  const baseline={Same:'समान',Reviewed:'टीचर की समीक्षा'};
  const first=shared.mergeOwnedMessages(baseline,{}, {Same:'समान',New:'नया'});
  assert.deepEqual(first.owned,{New:'नया'});
  const revised=shared.mergeOwnedMessages(first.messages,first.owned,{Same:'अलग',New:'सुधारा हुआ'});
  assert.equal(revised.messages.Same,baseline.Same);
  assert.equal(revised.messages.New,'सुधारा हुआ');
  assert.deepEqual(revised.owned,{New:'सुधारा हुआ'});
  assert.deepEqual(baseline,{Same:'समान',Reviewed:'टीचर की समीक्षा'});
  const editorial=shared.mergeOwnedMessages({...first.messages,New:'टीचर का संपादन'},first.owned,{New:'दूसरा ड्राफ़्ट'});
  assert.equal(editorial.messages.New,'टीचर का संपादन');
});

test('manual translations relinquish ownership across coincident authored revisions',()=>{
  const initial=shared.mergeOwnedMessages({}, {}, {Lesson:'पहला ड्राफ़्ट',OtherSubject:'दूसरा विषय'});
  const manual=Object.freeze({...initial.messages,Lesson:'टीचर का संपादन'});
  Object.freeze(initial.owned);
  const matchingAuthored=Object.freeze({Lesson:'टीचर का संपादन'});
  const second=shared.mergeOwnedMessages(manual,initial.owned,matchingAuthored);
  assert.equal(second.messages.Lesson,'टीचर का संपादन');

  const third=shared.mergeOwnedMessages(second.messages,second.owned,{Lesson:'नया ड्राफ़्ट'});
  assert.equal(third.messages.Lesson,'टीचर का संपादन');
  assert.deepEqual(second.owned,{OtherSubject:'दूसरा विषय'});
  assert.deepEqual(third.owned,{OtherSubject:'दूसरा विषय'});
  assert.equal(third.messages.OtherSubject,'दूसरा विषय');
  assert.deepEqual(initial.owned,{Lesson:'पहला ड्राफ़्ट',OtherSubject:'दूसरा विषय'});
  assert.deepEqual(manual,{Lesson:'टीचर का संपादन',OtherSubject:'दूसरा विषय'});
  assert.deepEqual(matchingAuthored,{Lesson:'टीचर का संपादन'});
});

test('ordinary manual conflicts relinquish ownership while owned updates continue',()=>{
  const existing=Object.freeze({Manual:'टीचर का संपादन',Automatic:'पहला ड्राफ़्ट',Unowned:'समान'});
  const previousOwned=Object.freeze({Manual:'पुराना ड्राफ़्ट',Automatic:'पहला ड्राफ़्ट',OtherSubject:'दूसरा विषय'});
  const authored=Object.freeze({Manual:'अलग ड्राफ़्ट',Automatic:'सुधारा हुआ',Unowned:'समान',New:'नया'});
  const result=shared.mergeOwnedMessages(existing,previousOwned,authored);
  assert.deepEqual(result.messages,{Manual:'टीचर का संपादन',Automatic:'सुधारा हुआ',Unowned:'समान',New:'नया'});
  assert.deepEqual(result.owned,{Automatic:'सुधारा हुआ',OtherSubject:'दूसरा विषय',New:'नया'});
});
