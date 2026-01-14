import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';

import { load } from './svgx.loader.mjs';

describe('SVGX loader', { concurrency: true }, () => {
	describe('load', () => {
		it('should ignore files that aren’t SVG', async () => {
			const result = await load(
				import.meta.resolve('../../fixtures/fixture.ext'),
				{},
				nextLoadAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should transpile the SVG to a JSX module', async () => {
			const fileUrl = import.meta.resolve('./fixtures/fixture.svg');
			const result = await load(fileUrl, { format: 'jsx' }, nextLoadAsync);

			const { source } = await nextLoadAsync(fileUrl, { format: 'jsx' });

			assert.equal(result.format, 'jsx'); // pass off to loadTSX
			assert.equal(
				result.source,
				`export default function Fixture() { return (\n${source}); }`,
			);
		});

		it('should throw a helpful error when a valid component name cannot be derived', () => {
			const fileUrl = import.meta.resolve('./fixtur$e.svg');

			try {
				load(
					fileUrl,
					{ format: 'jsx' },
					nextLoadAsync,
				);
				throw new Error('SHOULD HAVE THROWN');
			} catch (err) {
				assert.match(err.message, /component name/);
				assert.match(err.message, /fixtur\$e/);
				assert.match(err.message, /illegal/);
			}
		});
	});
});
