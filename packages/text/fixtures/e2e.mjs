import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import gql from './fixture.gql';
import tricky from './fixture-tricky.md';

// Read the same file directly so the expectation is the exact bytes on disk, not a second copy of
// the contents that could drift from the fixture.
const expected = readFileSync(new URL('./fixture-tricky.md', import.meta.url), 'utf8');

// Guard the fixture itself: if these sequences disappear, the import below would pass without
// exercising the escaping the loader has to preserve.
assert.ok(expected.includes('`const value = 1;`'), 'fixture must contain backticks');
assert.ok(expected.includes('${1 + 1}'), 'fixture must contain interpolatable text');
assert.ok(expected.includes('\\n'), 'fixture must contain a backslash escape');
assert.ok(expected.includes('\\\n'), 'fixture must contain a backslash before a newline');

assert.equal(tricky, expected);

console.log(gql);
