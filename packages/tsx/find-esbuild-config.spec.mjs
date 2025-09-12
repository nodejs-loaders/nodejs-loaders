import assert from 'node:assert/strict';
import { before, beforeEach, describe, it, mock } from 'node:test';

function mock_require_ENOENT() { throw { code: 'ENOENT' } }
function mock_require_empty_ret() { return }

describe('finding an ESbuild config', () => {
	const target = import.meta.resolve('./fixtures/whatever.ext');
	const pjsonLocus = target.replace('whatever.ext', 'package.json');
	const parentURL = import.meta.url;
	const NOT_FOUND = /No esbuild config found/;
	const NOT_FOUND_TARGET = new RegExp(target);

	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock_emitWarning;
	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock_createRequire;
	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock_findPackageJSON;
	/** @type {import('./find-esbuild-config.mjs').findEsbuildConfig} */
	let findEsbuildConfig;
	/** @type {import('./find-esbuild-config.mjs').defaults} */
	let esbuildConfigDefaults;
	/** @type {import('./find-esbuild-config.mjs').configs} */
	let configsMap;

	before(async () => {
		const emitWarning = mock.fn();
		mock_emitWarning = emitWarning.mock;
		const findPackageJSON = mock.fn();
		mock_findPackageJSON = findPackageJSON.mock;
		const createRequire = mock.fn();
		mock_createRequire = createRequire.mock;

		mock.module('node:process', { namedExports: { emitWarning } });
		mock.module('node:module', {
			namedExports: {
				createRequire,
				findPackageJSON,
			},
		});

		({
			configs: configsMap,
			defaults: esbuildConfigDefaults,
			findEsbuildConfig,
		} = await import('./find-esbuild-config.mjs'));
	});

	beforeEach(() => {
		configsMap.clear();
		mock_emitWarning.resetCalls();
		mock_findPackageJSON.resetCalls();
	});

	it('should warn when no config is found (no package.json)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => null);

		const result = findEsbuildConfig(target, parentURL);

		assert.equal(mock_emitWarning.callCount(), 1);
		const msg = mock_emitWarning.calls[0].arguments[0];
		assert.match(msg, NOT_FOUND);
		assert.match(msg, NOT_FOUND_TARGET);

		assert.deepEqual(result, esbuildConfigDefaults);
	});

	it('should warn when no config is found (package.json found but no config)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(() => mock_require_ENOENT);

		const result = findEsbuildConfig(target, parentURL);

		assert.equal(mock_emitWarning.callCount(), 1);
		const msg = mock_emitWarning.calls[0].arguments[0];
		assert.match(msg, NOT_FOUND);
		assert.match(msg, NOT_FOUND_TARGET);

		assert.deepEqual(result, esbuildConfigDefaults);
	});

	it('should not swallow unexpected errors', () => {
		const err = { code: 'SyntaxError' };
		function mock_require() { throw err }
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(() => mock_require);

		assert.throws(() => findEsbuildConfig(target, parentURL), err);
	});

	it('should return a cached result when it has it (defaults)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(() => mock_require_ENOENT);

		const result1 = findEsbuildConfig(target, parentURL);
		assert.deepEqual(result1, esbuildConfigDefaults);

		const result2 = findEsbuildConfig(target, parentURL);
		assert.equal(result1, result2);

		assert.equal(mock_findPackageJSON.callCount(), 1);
	});

	it('should return a cached result when it has it (non-defaults)', () => {
		const customConfig = { minify: false };
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(() => mock_require_empty_ret);

		const result1 = findEsbuildConfig(target, parentURL);
		assert.deepEqual(result1, {
			...esbuildConfigDefaults,
			...customConfig,
		});

		const result2 = findEsbuildConfig(target, parentURL);
		assert.equal(result1, result2);

		assert.equal(mock_findPackageJSON.callCount(), 1);
	});
});
