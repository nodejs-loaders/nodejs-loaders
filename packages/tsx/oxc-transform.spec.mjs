import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { load, resolve } from './oxc-transform.mjs';
import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

const jsxExts = new Set(['.jsx']);

const tsxExts = new Set(['.mts', '.ts', '.tsx']);

describe('JSX & TypeScript loader with packages/tsx/oxc-transform.mjs', () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise JSX files', async () => {
			for (const ext of jsxExts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'jsx',
					url: fileUrl,
				});
			}
		});

		it('should recognise TypeScript files', async () => {
			for (const ext of tsxExts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'tsx',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			for (const ext of jsxExts)
				await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'jsx');
			for (const ext of tsxExts)
				await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'tsx');
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t J|TSX', async () => {
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

		// is it digestible by react ?
		const transpiled = [
			'import { Wrapper } from "./wrapper.jsx";',
			'var _jsxFileName = "";',
			'import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";',
			'export function Greet({ name }) {',
			'\treturn _jsxDEV("h1", { children: ["Hello ", _jsxDEV(Wrapper, { children: name }, void 0, false, {',
			'\t\tfileName: _jsxFileName,',
			'\t\tlineNumber: 4,',
			'\t\tcolumnNumber: 20',
			'\t}, this)] }, void 0, true, {',
			'\t\tfileName: _jsxFileName,',
			'\t\tlineNumber: 4,',
			'\t\tcolumnNumber: 10',
			'\t}, this);',
			'}',
			'Greet.displayName = "Greet";\n',
		].join('\n');

		console.log(transpiled);

		it('should transpile JSX', async () => {
			const fileUrl = import.meta.resolve('./fixtures/with-config/main.jsx');
			const result = await load(fileUrl, { format: 'jsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});

		it('should transpile TSX', async () => {
			const fileUrl = import.meta.resolve('./fixtures/with-config/main.tsx');
			const result = await load(fileUrl, { format: 'tsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});
	});
});
