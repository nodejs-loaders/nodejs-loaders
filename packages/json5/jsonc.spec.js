import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { resolve, load } from './json5.js';

describe('json5 loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise json5 files', async () => {
			const result = await resolve(
				'./fixtures/valid.json5',
				{ importAttributes: { type: 'json5' } },
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'json5',
				url: './fixtures/valid.json5',
			});
		});

		it('should ignore json files that aren’t json5', async () => {
			const result = await resolve('./fixtures/valid.json', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixtures/valid.json',
			});
		});

		it('should ignore files that aren’t json at all', async () => {
			const result = await resolve(
				'../../fixtures/fixture.ext',
				{},
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: '../../fixtures/fixture.ext',
			});
		});

		it('should handle specifiers with appending data', async () => {
			await assertSuffixedSpecifiers(
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
				{ importAttributes: { type: 'json5' } },
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.txt',
			});
		});

		it('should ignore json if the import attribute is set', async () => {
			const result = await resolve(
				'./fixtures/valid.json',
				{
					importAttributes: { type: 'json5' },
				},
				nextResolve,
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
				nextLoad,
			);

			assert.equal(result.format, 'json');
			t.assert.snapshot(result.source);
		});
	});
});
