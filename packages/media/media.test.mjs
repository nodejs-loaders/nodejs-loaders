import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('media (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf-8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

	it('should work with `--loader`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./media.mjs')),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
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
				fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should accept additions via `module.register`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register-additions.mjs')),
				e2eTest.replace('e2e.mjs', 'e2e-added.mjs'),
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should accept deletions via `module.register`', async (t) => {
		const { code, stderr } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register-deletions.mjs')),
				e2eTest.replace('e2e.mjs', 'e2e-deleted.mjs'),
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.match(stderr, /ERR_UNKNOWN_FILE_EXTENSION/);
		assert.match(stderr, /".mp3"/);
		assert.equal(code, 1);
	});

	it('should work with `--import`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./media.mjs')),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.equal(stderr, '');
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});
});
