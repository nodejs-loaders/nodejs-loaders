import assert from 'node:assert/strict';
import { parseArgs } from 'node:util';

import { PREFIXES, SCOPE_RGX } from './pr-prefixes.mjs';

const { title } = parseArgs({
	options: {
		title: { type: 'string' },
	},
}).values;

// biome-ignore format: avoid mangling
const INVALID_PR_TITLE_ERR = '\
The pull request title did not match the required format; see CONTRIBUTING.md for details.\
';

assert.match(title, SCOPE_RGX, INVALID_PR_TITLE_ERR);
const firstParen = title.indexOf('(');
const prefix = title.slice(0, firstParen);

assert.ok(
	PREFIXES.includes(prefix),
	`The pull request title prefix '${prefix}' is not in the supported list: '${PREFIXES.join("', '")}'`,
);
