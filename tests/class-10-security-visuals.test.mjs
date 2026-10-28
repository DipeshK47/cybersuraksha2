import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './class-10-helpers.mjs';

const { chapters, manualFrame } = await loadSource(`
  export { class10SecurityChapters as chapters } from './app/data/class10/security';
  export { manualFrame } from './app/module/cyber/lessons/class10/motion-state';
`);

test('the documented fast offset remains visible in every resolved clock frame and exploration target', () => {
  const chapter = chapters.find(chapter => chapter.slug === 'class10-borrowed-tablet-clock');
  assert.ok(chapter, 'Clock chapter must exist');
  const visual = chapter.visual;
  const targets = visual.scenes.flatMap((scene, sceneIndex) =>
    scene.steps.map((_, step) => ({ name: `scene ${sceneIndex + 1} step ${step + 1}`, scene: sceneIndex, step })));
  assert.equal(targets.length, 18);
  assert.equal(visual.exploration.variants.length, 3);
  targets.push(...visual.exploration.variants.map(variant => ({ ...variant, name: `exploration ${variant.id}` })));

  const missing = [];
  for (const target of targets) {
    const frame = manualFrame(visual, target.scene, target.step);
    const clock = frame.nodes.find(node => node.id === 'clock');
    assert.ok(clock, `${target.name}: clock node must resolve`);
    assert.equal(clock.hidden, false, `${target.name}: offset node must remain visible`);
    for (const [language, offset] of [['en', /\b7 minutes fast\b/], ['hi', /7 मिनट आगे/]]) {
      const displayed = [clock.label[language], clock.value?.[language]].filter(Boolean).join(' ');
      if (!offset.test(displayed)) missing.push(`${target.name} ${language}: ${displayed}`);
    }
  }
  assert.deepEqual(missing, [], 'Every resolved visible clock label/value must retain the offset and its direction');
});
