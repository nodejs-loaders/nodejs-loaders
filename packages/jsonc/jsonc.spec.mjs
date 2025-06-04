import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertSuffixedSpecifiersAsync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';
import { resolve, load } from './jsonc.loader.mjs';

describe('JSONC loader', { concurrency: true }, () => {
	const ctx = { importAttributes: { type: 'jsonc' } };

	describe('resolve', () => {
		it('should recognise jsonc files', async () => {
			const result = await resolve(
				'./fixtures/valid.jsonc',
				ctx,
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'jsonc',
				url: './fixtures/valid.jsonc',
			});
		});

		it('should ignore json files that aren’t jsonc', async () => {
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
				'./fixtures/valid.jsonc',
				'jsonc',
				ctx,
			);
		});

		it('should ignore json files that aren’t jsonc', async () => {
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
		it('should handle files with comments', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/valid.jsonc'),
				{ format: 'jsonc' },
				nextLoadAsync,
			);

			const expected = [
				'{\n',
				'\t                  \n',
				'\t"foo": "bar",\n',
				'\t  \n',
				'\t                     \n',
				'\t  \n',
				'\t                     \n',
				'\t"baz": "qux",\n',
				'\t"quux": [\n',
				'\t\t"corge",\n',
				'\t\t"grault"\n',
				'\t]\n',
				'}\n',
			].join('');

			assert.equal(result.format, 'json');
			assert.equal(result.source.replaceAll('\r\n', '\n'), expected);
		});
	});
});
