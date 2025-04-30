import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './text.mjs';

describe('text loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise text files', async () => {
			for (const ext of Object.keys(exts)) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: exts[ext],
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			for (const [ext, format] of Object.entries(exts)) {
				await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, format);
			}
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t text', async () => {
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

		it('should generate a module from the text file', async () => {
			for (const ext of Object.keys(exts)) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await load(fileUrl, { format: 'graphql' }, nextLoad);

				const { source } = await nextLoad(fileUrl, {
					format: 'graphql',
				});

				assert.equal(result.format, 'module');
				assert.equal(result.source, `export default \`${source}\`;`);
			}
		});
	});
});
