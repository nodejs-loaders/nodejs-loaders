import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertSuffixedSpecifiersAsync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';
import { resolve, load } from './json5.loader.mjs';

describe('json5 loader', { concurrency: true }, () => {
	const ctx = { importAttributes: { type: 'json5' } };

	describe('resolve', () => {
		it('should recognise json5 files', async () => {
			const result = await resolve(
				'./fixtures/valid.json5',
				ctx,
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'json5',
				url: './fixtures/valid.json5',
			});
		});

		it('should ignore json files that aren’t json5', async () => {
			const result = await resolve('./fixtures/valid.json', {}, nextResolveAsync);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixtures/valid.json',
			});
		});

		it('should ignore files that aren’t json at all', async () => {
			const result = await resolve(
				'../../fixtures/fixture.ext',
				{},
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: '../../fixtures/fixture.ext',
			});
		});

		it('should handle specifiers with appending data', async () => {
			await assertSuffixedSpecifiersAsync(
				resolve,
				'./fixtures/valid.json5',
				'json5',
				{
					importAttributes: { type: 'json5' },
				},
			);
		});

		it('should ignore json files that aren’t json5', async () => {
			const result = await resolve(
				'./fixture.txt',
				ctx,
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.txt',
			});
		});

		it('should ignore json if the import attribute is set', async () => {
			const result = await resolve(
				'./fixtures/valid.json',
				ctx,
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixtures/valid.json',
			});
		});
	});

	describe('load', () => {
		it('should handle files with comments', async (t) => {
			const result = await load(
				import.meta.resolve('./fixtures/valid.json5'),
				{ format: 'json5' },
				nextLoadAsync,
			);

			assert.equal(result.format, 'json');
			t.assert.snapshot(result.source);
		});
	});
});
