import assert from 'node:assert/strict';

import { nextResolve } from '../fixtures/nextResolve.fixture.mjs';

export async function assertSuffixedSpecifiers(
	resolve,
	baseSpecifier,
	format,
	ctx = {},
) {
	let resolved = [];
	for (const [i, suffix] of suffixes.entries()) {
		const specifier = `${baseSpecifier}${suffix}`;
		resolved[i] = resolve(specifier, ctx, nextResolve).then((result) => ({
			url: specifier,
			result,
		}));
	}
	resolved = await Promise.all(resolved);

	for (const { url, result } of resolved) {
		assert.deepEqual(result, {
			format,
			url,
		});
	}
}

const suffixes = ['?foo', '#bar', '?foo#bar'];
