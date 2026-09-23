import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import gql from './fixture.gql';
import tricky from './fixture-tricky.md';

const expected = await readFile(new URL('./fixture-tricky.md', import.meta.url), 'utf8');

assert.equal(tricky, expected);

console.log(gql);
