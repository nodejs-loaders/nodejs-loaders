import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { message } from './fixtures/message.js';

describe('alias (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf-8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.js'));
	const msgRgx = new RegExp(message);

	it('should work with `--loader`', () => {
		const {
			status: code,
			stderr,
			stdout,
		} = spawnSync(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./alias.js')),
				e2eTest,
			],
			{
				cwd,
				encoding,
			},
		);

		assert.equal(stderr, '');
		assert.match(stdout, msgRgx);
		assert.equal(code, 0);
	});

	it('should work with `module.register`', () => {
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
			},
		);

		assert.equal(stderr, '');
		assert.match(stdout, msgRgx);
		assert.equal(code, 0);
	});

	if (process.version.startsWith('v23')) {
		it('should work with `module.registerHooks`', () => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register-hooks.js')),
					e2eTest,
				],
				{
					cwd,
					encoding,
				},
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
			assert.equal(code, 0);
		});
	}
});
