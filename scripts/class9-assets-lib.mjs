import {createHash} from 'node:crypto';
export const normalizeMessage=text=>text.replace(/\s+/g,' ').trim();

export function collectMessages(value,messages={}) {
  if(!value||typeof value!=='object') return messages;
  if(typeof value.en==='string'&&typeof value.hi==='string') messages[normalizeMessage(value.en)]=normalizeMessage(value.hi);
  else for(const child of Object.values(value)) collectMessages(child,messages);
  return messages;
}

export function narrationDigest(scenes,settings) {
  return createHash('sha256').update(JSON.stringify({settings,speech:scenes.map(scene=>scene.speech??scene.caption)})).digest('hex');
}

export function canReuseNarration(previous,scenes,settings) {
  return Boolean(previous?.duration>0&&previous.scenes?.length===scenes.length&&
    previous.narrationHash===narrationDigest(scenes,settings)&&
    scenes.every((scene,index)=>previous.scenes[index].caption===scene.caption&&
      (previous.scenes[index].speech??previous.scenes[index].caption)===(scene.speech??scene.caption)&&
      Number.isFinite(previous.scenes[index].start)&&previous.scenes[index].duration>0));
}

export function expandSpeech(text) {
  const words={AI:'A I',UPI:'U P I',OTP:'O T P',QR:'Q R',URL:'U R L',HTTPS:'H T T P S',HTTP:'H T T P',ID:'I D'};
  return text.replace(/\b(AI|UPI|OTP|QR|URL|HTTPS|HTTP|ID)\b/g,word=>words[word]);
}
