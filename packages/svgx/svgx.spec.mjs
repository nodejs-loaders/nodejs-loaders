import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';

import { load } from './svgx.loader.mjs';

describe('SVGX loader', { concurrency: true }, () => {
	describe('load', () => {
		it('should ignore files that aren’t SVG', async () => {
			const result = await load(
				import.meta.resolve('../../fixtures/fixture.ext'),
				{},
				nextLoad,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should transpile the SVG to a JSX module', async () => {
			const fileUrl = import.meta.resolve('./fixture.svg');
			const result = await load(fileUrl, { format: 'jsx' }, nextLoad);

			const { source } = await nextLoad(fileUrl, { format: 'jsx' });

			assert.equal(result.format, 'module');
			assert.equal(
				result.source,
				`export default function Fixture() { return (\n${source}); }`,
			);
		});

		it('should throw a helpful error when a valid component name cannot be derived', async () => {
			const fileUrl = import.meta.resolve('./fixtur$e.svg');

			const { message } = await load(
				fileUrl,
				{ format: 'jsx' },
				nextLoad,
			).catch((err) => err);

			assert.match(message, /component name/);
			assert.match(message, /fixtur\$e/);
			assert.match(message, /illegal/);
		});
	});
});
