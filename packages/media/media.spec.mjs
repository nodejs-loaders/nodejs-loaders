import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from '../../test/assert-suffixed-specifiers.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './media.loader.mjs';

function nextLoad_Err() { throw new Error('media file should not be read from disk') }

describe('media loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore unrecognised files', async () => {
			const specifier = '../../fixtures/fixture.ext';
			const result = await resolve(specifier, {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: specifier,
			});
		});

		it('should recognise media files', async () => {
			let resolved = [];
			let i = 0;
			for (const ext of exts) {
				const fileUrl = `./fixture.${ext}`;
				resolved[i++] = resolve(fileUrl, {}, nextResolve).then((result) => ({
					fileUrl,
					result,
				}));
			}

			resolved = await Promise.all(resolved);

			for (const { fileUrl, result } of resolved) {
				assert.deepEqual(result, {
					format: 'media',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			const resolved = [];
			let i = 0;
			for (const ext of exts) {
				resolved[i++] = assertSuffixedSpecifiers(resolve, `./fixture.${ext}`, 'media');
			}

			await Promise.all(resolved);
		});
	});

	describe('load', () => {
		it('should ignore unrecognised files', async () => {
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

		it('should return the resolved URL for the media file', async () => {
			let loaded = [];
			let i = 0;
			for (const ext of exts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				loaded[i++] = load(fileUrl, { format: 'media' }, nextLoad_Err).then((result) => ({
					ext,
					fileUrl,
					result,
				}));
			}

			loaded = await Promise.all(loaded);

			for (const { ext, result } of loaded) {
				assert.deepEqual(result, {
					format: 'module',
					shortCircuit: true,
					source: `export default 'file://[…]/packages/media/fixture${ext}';`,
				});
			}
		});
	});
});
