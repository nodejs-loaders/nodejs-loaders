import assert from 'node:assert/strict';
import { env } from 'node:process';

import { SUPPORTED_PREFIXES, SCOPE_RGX } from './pr-prefixes.mjs';

const { PR_TITLE } = env;

// biome-ignore format: avoid mangling
const INVALID_PR_TITLE_ERR = '\
The pull request title did not match the required format; see CONTRIBUTING.md for details.\
';

assert.match(PR_TITLE, SCOPE_RGX, INVALID_PR_TITLE_ERR);
const firstParen = PR_TITLE.indexOf('(');
const prefix = PR_TITLE.slice(0, firstParen);

assert.ok(
	SUPPORTED_PREFIXES.includes(prefix),
	`The pull request title prefix '${prefix}' is not in the supported list: '${SUPPORTED_PREFIXES.join("', '")}'`,
);
