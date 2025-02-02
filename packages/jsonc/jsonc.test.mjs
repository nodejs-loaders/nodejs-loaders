import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

const encoding = 'utf-8';
const env = { NO_COLOR: true };

describe('jsonc (e2e)', () => {
	describe('json', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve('./fixtures/e2e-json.mjs'),
		);

		it('should work with `--loader`', async (t) => {
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.register.mjs')),
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
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
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
					env,
				},
			);

			assert.equal(stderr, '');
			t.assert.snapshot(stdout);
			assert.equal(code, 0);
		});

		it('should work with `--import`', async (t) => {
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./jsonc.register.mjs')),
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

	describe('jsonc', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve('./fixtures/e2e-jsonc.mjs'),
		);

		it('should work with `--loader`', async (t) => {
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.register.mjs')),
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
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
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
					env,
				},
			);

			assert.equal(stderr, '');
			t.assert.snapshot(stdout);
			assert.equal(code, 0);
		});

		it('should work with `--import`', async (t) => {
			const {
				code,
				stderr,
				stdout,
			} = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./jsonc.register.mjs')),
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
});
