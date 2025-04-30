import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './media.mjs';

describe('media loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore unrecognised files', async () => {
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

		it('should recognise media files', async () => {
			for (const ext of exts) {
				const fileUrl = `./fixture.${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'media',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			for (const ext of exts)
				await assertSuffixedSpecifiers(resolve, `./fixture.${ext}`, 'media');
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
			for (const ext of exts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await load(fileUrl, { format: 'media' }, () => {
					throw new Error('media file should not be read from disk');
				});

				assert.deepEqual(result, {
					format: 'module',
					shortCircuit: true,
					source: `export default 'file://[…]/packages/media/fixture${ext}';`,
				});
			}
		});
	});
});
