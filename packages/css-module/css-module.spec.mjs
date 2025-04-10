import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from '../../test/assert-suffixed-specifiers.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';

import { resolve, load } from './css-module.loader.mjs';

describe('css-module loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise css module files', async () => {
			const result = await resolve(
				'./fixtures/fixture.module.css',
				{},
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'css-module',
				url: './fixtures/fixture.module.css',
			});
		});

		it('should ignore css files that aren’t css-modules', async () => {
			const result = await resolve('./fixture.css', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.css',
			});
		});

		it('should ignore files that aren’t css at all', async () => {
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
				nextLoad,
			);

			assert.equal(result.format, 'commonjs');
			assert.equal(result.source, `export = 'foo';\n`);
		});

		it('should handle files with nested and non-nested comments', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/fixture.module.css'),
				{ format: 'css-module' },
				nextLoad,
			);

			assert.equal(result.format, 'json');
			assert.deepEqual(
				result.source,
				JSON.stringify({
					Bar: 'Bar',
					Foo: 'Foo',
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
