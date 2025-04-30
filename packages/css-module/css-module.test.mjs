import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

describe('css-module (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf-8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

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
				fileURLToPath(import.meta.resolve('./css-module.mjs')),
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
});
