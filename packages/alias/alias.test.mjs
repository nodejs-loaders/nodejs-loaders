import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

import { message } from './fixtures/message.mjs';

describe('alias (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));
	const msgRgx = new RegExp(message);

	it('should work with `--loader`', async () => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./alias.mjs'),
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
				import.meta.resolve('./fixtures/register.mjs'),
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
					import.meta.resolve('./fixtures/register-hooks.mjs'),
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
				import.meta.resolve('./alias.mjs'),
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

	it('should incorporate `tsconfig.compileOptions.baseUrl`', async () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures/base-url'));
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				import.meta.resolve('./alias.mjs'),
				path.join(cwd, 'src/b/e2e.mjs'),
			],
			{
				cwd,
				encoding,
			},
		);

		assert.equal(stderr, '');
		assert.match(stdout, msgRgx);
		assert.match(stdout, /found foo/);
		assert.equal(code, 0);
	});

	describe('customising via `register`', () => {
		it('should accept a filename for tsconfig', async () => {
			const cwd = fileURLToPath(import.meta.resolve('./fixtures/customised-tsconfig-filename'));

			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					path.join(cwd, 'register.mjs'),
					path.join(cwd, 'e2e.mjs'),
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

		it('should accept a full location for tsconfig', async () => {
			const cwd = fileURLToPath(import.meta.resolve('./fixtures/customised-tsconfig-full-path'));

			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					path.join(cwd, 'register.mjs'),
					path.join(cwd, 'e2e.mjs'),
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

	describe('customising via `TS_NODE_PROJECT`', () => {
		it('should accept a filename for tsconfig', async () => {
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
					env: { TS_NODE_PROJECT: 'tsconfig.whatever.json' },
				},
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
			assert.equal(code, 0);
		});

		it('should accept a full location for tsconfig', async () => {
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
					env: { TS_NODE_PROJECT: import.meta.resolve('./fixtures/tsconfig.whatever.json') },
				},
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
			assert.equal(code, 0);
		});
	});
});
