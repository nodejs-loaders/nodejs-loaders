import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

describe('Mismatched format loader (unit)', () => {
	/** @type {import('./mismatched-format.loader.mjs').load} */
	let load;
	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock__containsCJS;

	before(async () => {
		const containsCJS = mock.fn();
		mock__containsCJS = containsCJS.mock;
		mock.module('./contains-cjs.mjs', { namedExports: { containsCJS } });

		({ load } = await import('./mismatched-format.loader.mjs'));
	});

	describe('when "esm" is actually cjs', () => {
		it('should detect and report the corrected format', async () => {
			mock__containsCJS.mockImplementationOnce(function mock__containsCJS() {
				return true;
			});
			const result = await load(
				import.meta.resolve('./unimportant.js'),
				{},
				async () => ({
					format: 'module',
					source: '"unimportant"',
				}),
			);

			assert.equal(result.format, 'commonjs');
		});

		it('should detect and report the corrected format', async () => {
			mock__containsCJS.mockImplementationOnce(function mock__containsCJS() {
				return false;
			});
			const result = await load(
				import.meta.resolve('./unimportant.js'),
				{},
				async () => {
					throw new Error('require and import');
				},
			);

			assert.equal(result.format, 'commonjs');
		});

		it('should detect and report the corrected format', async () => {
			mock__containsCJS.mockImplementationOnce(() => false);
			const result = await load(
				import.meta.resolve('./unimportant.js'),
				{},
				async () => {
					throw new Error('CommonJS');
				},
			);

			assert.equal(result.format, 'commonjs');
		});
	});
});
