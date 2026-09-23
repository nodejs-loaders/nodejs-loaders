import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiersAsync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './text.loader.mjs';

describe('text loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixtures/fixture.ext', {}, nextResolveAsync);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixtures/fixture.ext',
			});
		});

		it('should recognise text files', async () => {
			let resolved = [];
			let i = 0;
			for (const ext of Object.keys(exts)) {
				const fileUrl = `./fixture${ext}`;
				resolved[i++] = resolve(fileUrl, {}, nextResolveAsync).then((result) => ({
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
				cases[i++] = assertSuffixedSpecifiersAsync(resolve, `./fixture${ext}`, format);
			}

			await Promise.all(cases);
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t text', async () => {
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

		it('should generate a module from the text file', async () => {
			let loaded = [];
			let i = 0;
			for (const ext of Object.keys(exts)) {
				const fileUrl = import.meta.resolve(`./fixtures/fixture${ext}`);
				loaded[i++] = Promise.all([
					load(fileUrl, { format: 'graphql' }, nextLoadAsync),
					nextLoadAsync(fileUrl, { format: 'graphql' }).then(({ source }) => source),
				]);
			}

			loaded = await Promise.all(loaded);

			for (const [result, source ] of loaded) {
				assert.equal(result.format, 'module');
				assert.equal(result.source, `export default ${JSON.stringify(source)};`);
			}
		});

		it('should normalise binary sources to their text', async () => {
			const contents = '\uFEFFcafé — ✓\n';
			const bytes = Buffer.from(contents, 'utf8');
			const padded = Buffer.concat([Buffer.from('**'), bytes, Buffer.from('**')]);
			// A view that starts after the padding, so the loader must respect its offset and length.
			const view = new Uint8Array(padded.buffer, padded.byteOffset + 2, bytes.byteLength);
			const arrayBuffer = bytes.buffer.slice(
				bytes.byteOffset,
				bytes.byteOffset + bytes.byteLength,
			);

			const loaded = await Promise.all(
				[contents, bytes, arrayBuffer, view].map((source) => load(
					import.meta.resolve('./fixtures/fixture.md'),
					{ format: 'markdown' },
					async () => ({ format: 'markdown', source }),
				)),
			);

			for (const result of loaded) {
				assert.equal(result.source, `export default ${JSON.stringify(contents)};`);
			}
		});
	});
});
