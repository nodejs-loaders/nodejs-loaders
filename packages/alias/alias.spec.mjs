import assert from 'node:assert/strict';
import { before, describe, mock, it } from 'node:test';

import { nextResolveAsync, nextResolveSync } from '../../fixtures/nextResolve.fixture.mjs';

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

	describe('chains', () => {
		const specifier = './fixtures/message.mjs';
		const resultOfPassthrough = {
			format: 'unknown',
			url: specifier,
		};

		let resolve;

		before(async () => {
			({ resolve } = await import('./alias.loader.mjs'));
		});

		it('should work in an async chain', async () => {
			const result = resolve(specifier, ctx, nextResolveAsync);

			assert.ok(result instanceof Promise);

			assert.deepEqual(await result, resultOfPassthrough);
		});

		it('should work in an sync chain', () => {
			const result = resolve(specifier, ctx, nextResolveSync);

			assert.ok(!(result instanceof Promise));

			assert.deepEqual(result, resultOfPassthrough);
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

		it('should de-alias a prefixed specifier', () => {
			assert.equal(
				resolve('…/test.mjs', ctx, nextResolveSync).url,
				`${base}/src/test.mjs`,
			);
		});

		it('should de-alias a pointer (fully-qualified url) specifier', () => {
			assert.equal(resolve('ENV', ctx, nextResolveSync).url, aliases.ENV[0]);
		});

		it('should de-alias a pointer (absolute path) specifier', () => {
			assert.equal(resolve('VARS', ctx, nextResolveSync).url, aliases.VARS[0]);
		});

		it('should maintain any suffixes on the prefixed specifier', () => {
			assert.equal(
				resolve('…/test.mjs?foo', ctx, nextResolveSync).url,
				`${base}/src/test.mjs?foo`,
			);
			assert.equal(
				resolve('…/test.mjs#bar', ctx, nextResolveSync).url,
				`${base}/src/test.mjs#bar`,
			);
			assert.equal(
				resolve('…/test.mjs?foo#bar', ctx, nextResolveSync).url,
				`${base}/src/test.mjs?foo#bar`,
			);
		});

		it('should maintain any suffixes on the pointer (fully-qualified url) specifier', () => {
			assert.equal(
				resolve('ENV?foo', ctx, nextResolveSync).url,
				`${aliases.ENV[0]}?foo`,
			);
			assert.equal(
				resolve('ENV#bar', ctx, nextResolveSync).url,
				`${aliases.ENV[0]}#bar`,
			);
			assert.equal(
				resolve('ENV?foo#bar', ctx, nextResolveSync).url,
				`${aliases.ENV[0]}?foo#bar`,
			);
		});

		it('should maintain any suffixes on the pointer (absolute path) specifier', () => {
			assert.equal(
				resolve('VARS?foo', ctx, nextResolveSync).url,
				`${aliases.VARS[0]}?foo`,
			);
			assert.equal(
				resolve('VARS#bar', ctx, nextResolveSync).url,
				`${aliases.VARS[0]}#bar`,
			);
			assert.equal(
				resolve('VARS?foo#bar', ctx, nextResolveSync).url,
				`${aliases.VARS[0]}?foo#bar`,
			);
		});

		describe('that are unresolvable', () => {
			it('(async) should not fail internally', () => {
				async function nextUnresolveable(s) {
					throw new ERR_MODULE_NOT_FOUND(s);
				}

				const specifier = '…/noexist.mjs';

				assert.rejects(
					() => resolve(specifier, ctx, nextUnresolveable),
					new RegExp(specifier),
				);
			});

			it('(sync) should not fail internally', () => {
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
