import assert from 'node:assert/strict';

import { nextResolveAsync, nextResolveSync } from '../fixtures/nextResolve.fixture.mjs';

export async function assertSuffixedSpecifiersAsync(
	resolve,
	baseSpecifier,
	format,
	ctx = {},
) {
	let resolved = [];
	for (const [i, suffix] of suffixes.entries()) {
		const specifier = `${baseSpecifier}${suffix}`;
		resolved[i] = resolve(specifier, ctx, nextResolveAsync).then((result) => ({
			result,
			url: specifier,
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

export function assertSuffixedSpecifiersSync(
	resolve,
	baseSpecifier,
	format,
	ctx = {},
) {
	for (const suffix of suffixes) {
		const specifier = `${baseSpecifier}${suffix}`;
		const result = resolve(specifier, ctx, nextResolveSync);

		assert.deepEqual(result, {
			format,
			url: specifier,
		});
	}
}

const suffixes = ['?foo', '#bar', '?foo#bar'];
