import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

import { message } from './fixtures/message.mjs';

describe('alias (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf-8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));
	const msgRgx = new RegExp(message);

	it('should work with `--loader`', async () => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./alias.mjs')),
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

	it('should work with `module.register`', async () => {
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
			},
		);

		assert.equal(stderr, '');
		assert.match(stdout, msgRgx);
		assert.equal(code, 0);
	});

	if (process.version.startsWith('v23')) {
		it('should work with `module.registerHooks`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register-hooks.mjs')),
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

	it('should work with `--import`', async () => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./alias.mjs')),
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
});
