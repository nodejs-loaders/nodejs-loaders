import assert from 'node:assert/strict';
import { before, describe, mock, test } from 'node:test';

import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

describe('alias', { concurrency: true }, () => {
	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock_readFileSync;
	const base = 'file://';
	const aliases = {
		'…/*': ['./src/*'],
		ENV: ['https://example.com/env.json'],
		VARS: ['/vars.json'],
	};
	const ctx = { parentURL: import.meta.url };

	class ENOENT extends Error {
		code = 'ENOENT';
		name = 'ENOENT';
	}
	class ERR_MODULE_NOT_FOUND extends Error {
		code = 'ERR_MODULE_NOT_FOUND';
		name = 'ERR_MODULE_NOT_FOUND';
	}

	before(async () => {
		const readFileSync = mock.fn(function mock_readFileSync() {});
		mock_readFileSync = readFileSync.mock;
		mock.module('node:fs', { namedExports: { readFileSync } });
		mock.module('node:module', {
			namedExports: {
				findPackageJSON: mock.fn(function mock_findPackageJSON() { return '/package.json' }),
			},
		});
	});

	describe('that are in tsconfig.json', () => {
		let resolve;

		before(async () => {
			mock_readFileSync.mockImplementation( function mock_readFileSync(p) {
				if (p.pathname.includes('/tsconfig.json')) {
					return JSON.stringify({
						compilerOptions: { paths: aliases },
					});
				}
				throw new ENOENT(); // For any other file access, throw ENOENT
			});

			({ resolve } = await import('./alias.loader.mjs'));
		});

		test('should de-alias a prefixed specifier', () => {
			assert.equal(
				resolve('…/test.mjs', ctx, nextResolve).url,
				`${base}/src/test.mjs`,
			);
		});

		test('should de-alias a pointer (fully-qualified url) specifier', () => {
			assert.equal(resolve('ENV', ctx, nextResolve).url, aliases.ENV[0]);
		});

		test('should de-alias a pointer (absolute path) specifier', () => {
			assert.equal(resolve('VARS', ctx, nextResolve).url, aliases.VARS[0]);
		});

		test('should maintain any suffixes on the prefixed specifier', () => {
			assert.equal(
				resolve('…/test.mjs?foo', ctx, nextResolve).url,
				`${base}/src/test.mjs?foo`,
			);
			assert.equal(
				resolve('…/test.mjs#bar', ctx, nextResolve).url,
				`${base}/src/test.mjs#bar`,
			);
			assert.equal(
				resolve('…/test.mjs?foo#bar', ctx, nextResolve).url,
				`${base}/src/test.mjs?foo#bar`,
			);
		});

		test('should maintain any suffixes on the pointer (fully-qualified url) specifier', () => {
			assert.equal(
				resolve('ENV?foo', ctx, nextResolve).url,
				`${aliases.ENV[0]}?foo`,
			);
			assert.equal(
				resolve('ENV#bar', ctx, nextResolve).url,
				`${aliases.ENV[0]}#bar`,
			);
			assert.equal(
				resolve('ENV?foo#bar', ctx, nextResolve).url,
				`${aliases.ENV[0]}?foo#bar`,
			);
		});

		test('should maintain any suffixes on the pointer (absolute path) specifier', () => {
			assert.equal(
				resolve('VARS?foo', ctx, nextResolve).url,
				`${aliases.VARS[0]}?foo`,
			);
			assert.equal(
				resolve('VARS#bar', ctx, nextResolve).url,
				`${aliases.VARS[0]}#bar`,
			);
			assert.equal(
				resolve('VARS?foo#bar', ctx, nextResolve).url,
				`${aliases.VARS[0]}?foo#bar`,
			);
		});

		describe('that are unresolvable', () => {
			test('(async) should not fail internally', () => {
				async function nextUnresolveable(s) {
					throw new ERR_MODULE_NOT_FOUND(s);
				}

				const specifier = '…/noexist.mjs';

				assert.rejects(
					() => resolve(specifier, ctx, nextUnresolveable),
					new RegExp(specifier),
				);
			});

			test('(sync) should not fail internally', () => {
				function nextUnresolveable(s) {
					throw new ERR_MODULE_NOT_FOUND(s);
				}

				const specifier = '…/noexist.mjs';

				assert.throws(
					() => resolve(specifier, ctx, nextUnresolveable),
					new RegExp(specifier),
				);
			});
		});
	});
});
