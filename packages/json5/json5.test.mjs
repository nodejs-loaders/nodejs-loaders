import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

const encoding = 'utf8';
const env = { NO_COLOR: true };

describe('json5 (e2e)', { concurrency: true }, () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const e2eTest = fileURLToPath(
		import.meta.resolve('./fixtures/e2e-json5.mjs'),
	);

	it('should work with `--loader`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./json5.mjs'),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env,
			},
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should work with `module.register`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				import.meta.resolve('./fixtures/register.mjs'),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env,
			},
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
				'--import',
				import.meta.resolve('./json5.mjs'),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env,
			},
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});
});
