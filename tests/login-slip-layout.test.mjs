import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = file => readFileSync(join(root, file), 'utf8');

test('a login slip puts the password on its own full-width row, with the sign-in steps', () => {
  const page = read('app/teach/page.tsx');
  assert.match(page, /className="slipPassword"><dt>Password<\/dt><dd>\{student\.accessCode\}/);
  assert.match(page, /Sign in on the student login page: choose your school, then enter your class, roll number and password\./);
});

test('slips wrap their content instead of squeezing it into narrow columns', () => {
  const css = read('app/cybersuraksha.css');
  const globals = read('app/globals.css');
  // Cards flow by available width, and long values wrap rather than overflow.
  assert.match(css, /\.slipGrid\s*\{[^}]*repeat\(auto-fill, minmax\(min\(100%, 280px\), 1fr\)\)/);
  assert.match(css, /\.loginSlip dd\s*\{[^}]*overflow-wrap: anywhere/);
  assert.match(css, /\.loginSlip dl > \.slipPassword\s*\{[^}]*grid-column: 1 \/ -1/);
  // The old rules that fought each other are gone: no 4-column slip grid, no 3-column field row.
  assert.doesNotMatch(css, /\.slipGrid,\s*\n\.metricGrid/);
  assert.doesNotMatch(globals, /\.loginSlip dl\s*\{/);
});

test('printed slips come two across with a dashed cut line', () => {
  const css = read('app/cybersuraksha.css');
  const print = css.slice(css.indexOf('@media print'));
  assert.match(print, /\.slipGrid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(print, /\.loginSlip\s*\{[^}]*1\.5px dashed/);
});

test('the slip instruction has a Hindi translation', () => {
  const overrides = JSON.parse(read('app/lib/i18n/hi-overrides.json'));
  const key = 'Sign in on the student login page: choose your school, then enter your class, roll number and password.';
  assert.match(overrides[key] ?? '', /[ऀ-ॿ]/u);
});
