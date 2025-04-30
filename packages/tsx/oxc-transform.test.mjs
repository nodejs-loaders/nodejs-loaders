import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

const skip = +process.version.slice(1, 3) < 23;

describe('JSX & TypeScript loader (e2e) whit oxc-transform', { skip }, () => {
	/**
	 * If react isn't found, the transpilation has happened. If there is another error, the
	 * transpilation failed (kind of hypothetical)
	 */
	it('--loader should load a TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./oxc-transform.mjs')),
				path.join(cwd, 'main.tsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'react' imported from/);
		assert.equal(stdout, '');
	});

	it('--import should load a TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'oxc-transform-register.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			},
		);

		assert.match(stderr, /Cannot find package 'react' imported from/);
		assert.equal(stdout, '');
	});
});
