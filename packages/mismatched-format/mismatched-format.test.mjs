import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { load } from './mismatched-format.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';

describe('Mismatched format loader (e2e)', () => {
	describe('correctly identify the containing CJS as CJS, despite "type": "module"', () => {
		it('should handle `require()`', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/actually-cjs/uses-require.cjs.js'),
				{},
				nextLoad,
			);

			assert.equal(result.format, 'commonjs');
		});

		it('should handle `module.exports`', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/actually-cjs/module-exports.cjs.js'),
				{},
				nextLoad,
			);

			assert.equal(result.format, 'commonjs');
		});
	});

	describe('correctly identify the containing ESM as ESM, despite "type": "commonjs"', () => {
		it('should handle createRequire', async () => {
			const result = await load(
				import.meta.resolve('./fixtures/actually-esm/create-require.esm.js'),
				{},
				nextLoad,
			);

			assert.equal(result.format, 'module');
		});

		it('should handle `require()` within a comment', async () => {
			const result = await load(
				import.meta.resolve(
					'./fixtures/actually-esm/require-in-comment.esm.js',
				),
				{},
				nextLoad,
			);

			assert.equal(result.format, 'module');
		});
	});
});
