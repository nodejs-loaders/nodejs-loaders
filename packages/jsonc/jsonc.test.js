import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const encoding = 'utf-8';
const env = { NO_COLOR: true };

describe('jsonc (e2e)', () => {
	describe('json', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve('./fixtures/e2e-json.js'),
		);

		it('should work with `--loader`', (t) => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.js')),
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

		it('should work with `module.register`', (t) => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register.js')),
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
			import.meta.resolve('./fixtures/e2e-jsonc.js'),
		);

		it('should work with `--loader`', (t) => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.js')),
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

		it('should work with `module.register`', (t) => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register.js')),
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
