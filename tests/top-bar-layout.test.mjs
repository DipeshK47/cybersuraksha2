import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const css = readFileSync(join(process.cwd(), 'app/cybersuraksha.css'), 'utf8');
const section = css.slice(css.indexOf('Top bars: one layout that holds at every screen size'));
const block = (selector, source = section) => {
  const start = source.indexOf(selector);
  assert.ok(start >= 0, selector);
  return source.slice(start, source.indexOf('}', start));
};

test('top bars stay on one row and shrink the badge before anything wraps', () => {
  assert.match(block('.dashboardNavInner,\n.gradeNav,\n.teacherHeader'), /flex-wrap: nowrap !important/);
  assert.match(block('.dashboardNavRight,\n.gradeNav > div,'), /flex-wrap: nowrap !important/);
  assert.match(block('.dashboardOrg {'), /max-width: clamp\(/);
  assert.match(block('.gradeNav > div > span {'), /text-overflow: ellipsis/);
});

test('top bars line up with the page content instead of being padded twice', () => {
  assert.match(block('.dashboardNav {'), /padding-inline: 0/);
  assert.match(block('.dashboardNavInner {'), /width: min\(1320px, calc\(100% - 40px\)\)/);
  assert.match(block('.dashboardNavInner {'), /padding: 0 !important/);
});

test('below 900px the bar stacks into tiers whose buttons share each row', () => {
  const narrow = section.slice(section.indexOf('@media (max-width: 899px)'));
  assert.match(block('flex-direction: column', narrow), /align-items: stretch/);
  // The old fixed 62px row would let the second tier spill onto the page.
  assert.match(block('.dashboardNavInner {', narrow), /height: auto !important/);
  assert.match(narrow, /flex: 1 1 auto !important/);
});
