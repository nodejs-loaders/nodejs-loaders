import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('JSX & TypeScript loader (e2e)', { concurrency: true }, () => {
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

	it('--import should load a TSX file but fail because of missing react package', async () => {
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
});
