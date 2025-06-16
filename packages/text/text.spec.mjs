import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from '../../test/assert-suffixed-specifiers.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './text.loader.mjs';

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
			let resolved = [];
			let i = 0;
			for (const ext of Object.keys(exts)) {
				const fileUrl = `./fixture${ext}`;
				resolved[i++] = resolve(fileUrl, {}, nextResolve).then((result) => ({
					ext,
					fileUrl,
					result,
				}));
			}
			resolved = await Promise.all(resolved);

			for (const { ext, fileUrl, result } of resolved) {
				assert.deepEqual(result, {
					format: exts[ext],
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			const cases = [];
			let i = 0;
			for (const [ext, format] of Object.entries(exts)) {
				cases[i++] = assertSuffixedSpecifiers(resolve, `./fixture${ext}`, format);
			}

			await Promise.all(cases);
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
			let loaded = [];
			let i = 0;
			for (const ext of Object.keys(exts)) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				loaded[i++] = Promise.all([
					load(fileUrl, { format: 'graphql' }, nextLoad),
					nextLoad(fileUrl, { format: 'graphql' }).then(({ source }) => source),
				]);
			}

			loaded = await Promise.all(loaded);

			for (const [result, source] of loaded) {
				assert.equal(result.format, 'module');
				assert.equal(result.source, `export default \`${source}\`;`);
			}
		});
	});
});
