import assert from 'node:assert/strict';
import { before, beforeEach, describe, it, mock } from 'node:test';

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
	/** @type {import('./find-esbuild-config.js').findEsbuildConfig} */
	let findEsbuildConfig;
	/** @type {import('./find-esbuild-config.js').defaults} */
	let esbuildConfigDefaults;
	/** @type {import('./find-esbuild-config.js').configs} */
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
		} = await import('./find-esbuild-config.js'));
	});

	beforeEach(() => {
		configsMap.clear();
		mock_emitWarning.resetCalls();
		mock_findPackageJSON.resetCalls();
	});

	it('should warn when no config is found (no package.json)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => undefined);

		const result = findEsbuildConfig(target, parentURL);

		assert.equal(mock_emitWarning.callCount(), 1);
		const msg = mock_emitWarning.calls[0].arguments[0];
		assert.match(msg, NOT_FOUND);
		assert.match(msg, NOT_FOUND_TARGET);

		assert.deepEqual(result, esbuildConfigDefaults);
	});

	it('should warn when no config is found (package.json found but no config)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(
			() =>
				function mock_require() {
					throw { code: 'ENOENT' };
				},
		);

		const result = findEsbuildConfig(target, parentURL);

		assert.equal(mock_emitWarning.callCount(), 1);
		const msg = mock_emitWarning.calls[0].arguments[0];
		assert.match(msg, NOT_FOUND);
		assert.match(msg, NOT_FOUND_TARGET);

		assert.deepEqual(result, esbuildConfigDefaults);
	});

	it('should not swallow unexpected errors', () => {
		const err = { code: 'SyntaxError' };
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(
			() =>
				function mock_require() {
					throw err;
				},
		);

		assert.throws(() => findEsbuildConfig(target, parentURL), err);
	});

	it('should return a cached result when it has it (defaults)', () => {
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(
			() =>
				function mock_require() {
					throw { code: 'ENOENT' };
				},
		);

		const result1 = findEsbuildConfig(target, parentURL);
		assert.deepEqual(result1, esbuildConfigDefaults);

		const result2 = findEsbuildConfig(target, parentURL);
		assert.equal(result1, result2);

		assert.equal(mock_findPackageJSON.callCount(), 1);
	});

	it('should return a cached result when it has it (non-defaults)', () => {
		const customConfig = { minify: true };
		mock_findPackageJSON.mockImplementationOnce(() => pjsonLocus);
		mock_createRequire.mockImplementationOnce(
			() =>
				function mock_require() {
					return;
				},
		);

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
