import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiersAsync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';

import { exts, load, resolve } from './text.loader.mjs';

/**
 * Imports a generated module through a data URL so the test observes what the module evaluates to,
 * not only the source the loader produced.
 * @param {string} source Generated module source.
 * @returns {Promise<unknown>} The module's default export.
 */
async function importGenerated(source) {
	const { default: value } = await import(`data:text/javascript,${encodeURIComponent(source)}`);

	return value;
}

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

		it('should import text literally instead of evaluating it', async () => {
			// Written as a template literal so the placeholder text does not trip
			// `no-template-curly-in-string`; escaping keeps every sequence literal.
			const contents = `code: \`x\`\n\${1 + 1}\na\\nb\n"quoted"\n`;
			const result = await load(
				import.meta.resolve('./fixtures/fixture.md'),
				{ format: 'markdown' },
				async () => ({ format: 'markdown', source: contents }),
			);

			assert.equal(result.source, `export default ${JSON.stringify(contents)};`);
			assert.equal(await importGenerated(result.source), contents);
		});

		it('should normalise binary sources to their text', async () => {
			// The leading mark and non-ASCII characters catch a decoder that drops the mark or
			// mis-reads multi-byte characters.
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
				[contents, bytes, arrayBuffer, view].map(async (source) => {
					const result = await load(
						import.meta.resolve('./fixtures/fixture.md'),
						{ format: 'markdown' },
						async () => ({ format: 'markdown', source }),
					);

					return [result.format, await importGenerated(result.source)];
				}),
			);

			for (const [format, text] of loaded) {
				assert.equal(format, 'module');
				assert.equal(text, contents);
			}
		});
	});
});
