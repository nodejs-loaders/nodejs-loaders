import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiersAsync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';

import { resolve, load } from './css-module.loader.mjs';

describe('css-module loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise css module files', async () => {
			const result = await resolve(
				'./fixtures/fixture.module.css',
				{},
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'css-module',
				url: './fixtures/fixture.module.css',
			});
		});

		it('should ignore css files that aren’t css-modules', async () => {
			const result = await resolve('./fixture.css', {}, nextResolveAsync);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.css',
			});
		});

		it('should ignore files that aren’t css at all', async () => {
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
				'./fixtures/fixture.module.css',
				'css-module',
			);
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t css-modules', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/fixture.js'),
				{ format: 'commonjs' },
				nextLoadAsync,
			);

			assert.equal(result.format, 'commonjs');
			assert.equal(result.source.trim(), `export = 'foo';`);
		});

		it('should handle files with nested and non-nested comments', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/fixture.module.css'),
				{ format: 'css-module' },
				nextLoadAsync,
			);

			assert.equal(result.format, 'json');
			assert.deepEqual(
				result.source,
				JSON.stringify({ // oxlint-disable-line sort-keys
					Foo: 'Foo',
					Bar: 'Bar',
					Qux: 'Qux',
					Zed: 'Zed',
					img: 'img',
					nested: 'nested',
					something: 'something',
				}),
			);
		});
	});
});
