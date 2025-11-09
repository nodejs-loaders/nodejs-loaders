import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('SVGX (e2e)', { concurrency: true }, () => {
	const opts = {
		cwd: fileURLToPath(import.meta.resolve('./fixtures')),
		encoding: 'utf8',
		env: { NO_COLOR: true },
	};
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

	const textLoader = import.meta.resolve('@nodejs-loaders/text');
	const tsxLoader = import.meta.resolve('@nodejs-loaders/tsx');

	it('should work with `--loader`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader', import.meta.resolve('./svgx.mjs'),
				'--loader', textLoader,
				'--loader', tsxLoader,
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, '', 'stderr');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should work with `module.register`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import', import.meta.resolve('./fixtures/register.mjs'),
				'--import', textLoader,
				'--import', tsxLoader,
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should work with `module.registerHooks`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import', import.meta.resolve('./fixtures/register-hooks.mjs'),
				'--import', textLoader,
				'--import', tsxLoader,
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should work with `--import`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import', import.meta.resolve('./svgx.mjs'),
				'--import', textLoader,
				'--import', tsxLoader,
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});
});
