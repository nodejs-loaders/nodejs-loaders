import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

const skip = +process.version.slice(1, 3) < 23;

describe('JSX & TypeScript loader (e2e)', { concurrency: true, skip }, () => {
	/**
	 * If the runtime package isn't found, the transpilation has happened. If there is another error, the
	 * transpilation failed (kind of hypothetical)
	 */
	it('--loader should load a React TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./tsx.mjs'),
				path.join(cwd, 'main.tsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'react' imported from/);
		assert.equal(stdout, '');
	});

	it('--import should load a React JSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'register.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'react' imported from/);
		assert.equal(stdout, '');
	});

	it('--loader should load a Preact TSX file but fail because of missing preact package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-preact');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./tsx.mjs'),
				path.join(cwd, 'main.tsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'preact' imported from/);
		assert.equal(stdout, '');
	});

	it('--import should load a Preact JSX file but fail because of missing preact package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-preact');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'register.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'preact' imported from/);
		assert.equal(stdout, '');
	});

	it('--loader should load a SolidJS TSX file but fail because of missing solid-js package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-solid');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./tsx.mjs'),
				path.join(cwd, 'main.tsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'solid-js' imported from/);
		assert.equal(stdout, '');
	});

	it('--import should load a SolidJS JSX file but fail because of missing solid-js package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-solid');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'register.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'solid-js' imported from/);
		assert.equal(stdout, '');
	});
});
