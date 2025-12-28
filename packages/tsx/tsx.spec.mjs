import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

import { assertSuffixedSpecifiersSync } from '../../test/assert-suffixed-specifiers.mjs';
import { nextLoadAsync, nextLoadSync } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolveAsync, nextResolveSync } from '../../fixtures/nextResolve.fixture.mjs';

const skip = +process.version.slice(1, 3) < 23;

const jsxExts = new Set(['.jsx']);

const tsxExts = new Set(['.mts', '.ts', '.tsx']);

describe('JSX & TypeScript loader', { concurrency: true, skip }, () => {
	let load;
	let resolve;

	before(async () => {
		// This is necessary because now `load` depends on `resolve` having run.
		const esbuildConfig = {
			...(await import('./find-esbuild-config.mjs')).defaults,
			...(await import('./fixtures/with-config/esbuild.config.mjs')).default,
		};
		mock.module('./find-esbuild-config.mjs', {
			namedExports: { findEsbuildConfig: () => esbuildConfig },
		});

		({ load, resolve } = await import('./tsx.loader.mjs'));
	});

	describe('resolve', () => {
		describe('chains', () => {
			const resultOfUnknown = {
				format: 'unknown',
				url: './fixture.ext',
			};

			/**
			 * Also assert case "should ignore files that aren’t text"
			 */

			it('should work in an async chain', async () => {
				const result = resolve('./fixture.ext', {}, nextResolveAsync);

				assert.ok(result instanceof Promise);

				assert.deepEqual(await result, resultOfUnknown);
			});

			it('should work in a sync chain', () => {
				const result = resolve('./fixture.ext', {}, nextResolveSync);

				assert.ok(!(result instanceof Promise));

				assert.deepEqual(result, resultOfUnknown);
			});
		});

		it('should recognise JSX files', () => {
			for (const ext of jsxExts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = resolve(fileUrl, {}, nextResolveSync);
				assert.deepEqual(result, {
					format: 'jsx',
					url: fileUrl,
				});
			}
		});

		it('should recognise TypeScript files', () => {
			for (const ext of tsxExts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = resolve(fileUrl, {}, nextResolveSync);
				assert.deepEqual(result, {
					format: 'tsx',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', () => {
			for (const ext of jsxExts) {
				assertSuffixedSpecifiersSync(resolve, `./fixture${ext}`, 'jsx');
			}
			for (const ext of tsxExts) {
				assertSuffixedSpecifiersSync(resolve, `./fixture${ext}`, 'tsx');
			}
		});
	});

	describe('load', () => {
		describe('chains', () => {
			const resultOfUnknown = {
				format: 'unknown',
				source: '',
			};

			/**
			 * Also assert case "should ignore files that aren’t J|TSX"
			 */

			it('should work in an async chain', async () => {
				const result = load(
					import.meta.resolve('../../fixtures/fixture.ext'),
					{},
					nextLoadAsync,
				);

				assert.ok(result instanceof Promise);

				assert.deepEqual(await result, resultOfUnknown);
			});

			it('should work in a sync chain', () => {
				const result = load(
					import.meta.resolve('../../fixtures/fixture.ext'),
					{},
					nextLoadSync,
				);

				assert.ok(!(result instanceof Promise));

				assert.deepEqual(result, resultOfUnknown);
			});
		});

		// This verifies that esbuild.config.mjs is being loaded correctly because the one in this repo
		// disables minification, but the loader's default config enables it.
		const transpiled = [
			'import { jsxDEV } from "react/jsx-dev-runtime";',
			'import { Wrapper } from "./wrapper.jsx";',
			'export function Greet({ name }) {',
			'  return /* @__PURE__ */ jsxDEV("h1", { children: [',
			'    "Hello ",',
			'    /* @__PURE__ */ jsxDEV(Wrapper, { children: name }, void 0, false, {',
			'      fileName: "<stdin>",',
			'      lineNumber: 4,',
			'      columnNumber: 20',
			'    }, this)',
			'  ] }, void 0, true, {',
			'    fileName: "<stdin>",',
			'    lineNumber: 4,',
			'    columnNumber: 10',
			'  }, this);',
			'}',
			'Greet.displayName = "Greet";',
			'', //EoF
		].join('\n');

		it('should transpile JSX', () => {
			const fileUrl = import.meta.resolve('./fixtures/with-config/main.jsx');
			const result = load(fileUrl, { format: 'jsx' }, nextLoadSync);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled.replaceAll('<stdin>', fileUrl));
		});

		it('should transpile TSX', () => {
			const fileUrl = import.meta.resolve('./fixtures/with-config/main.tsx');
			const result = load(fileUrl, { format: 'tsx' }, nextLoadSync);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled.replaceAll('<stdin>', fileUrl));
		});

		it('should log transpile errors', () => {
			const badJSX = 'const Foo (a) => (<div />)'; // missing `=`
			const orig_consoleError = console.error; // oxlint-disable-line no-console

			const consoleErr = (globalThis.console.error = mock.fn());

			load(
				'whatever.jsx',
				{
					format: 'jsx',
					parentURL: import.meta.url,
				},
				() => ({ source: badJSX }),
			);

			const errLog = consoleErr.mock.calls[0].arguments[0];

			assert.match(errLog, /TranspileError/);
			assert.match(errLog, /found "\("/);

			globalThis.console.error = orig_consoleError;
		});
	});
});
