import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('JSX & TypeScript loader oxc (e2e)', { concurrency: true }, () => {
	it('--loader should load a TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				import.meta.resolve('./tsx-oxc.mjs'),
				path.join(cwd, 'main.tsx'),
			],
			{
				cwd,
			},
		);

		assert.equal(stderr, '');
		assert.equal(stdout, '');
	});

	it('--import should load a TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'register-oxc.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			},
		);

		assert.equal(stderr, '');
		assert.equal(stdout, '');
	});

	it("should work with source maps", async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures/with-config');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--enable-source-maps',
				`--import=${path.join(cwd, 'register-oxc.mjs')}`,
				path.join(cwd, 'with-fail.jsx'),
			],
			{
				cwd,
				env: {
					NO_COLOR: '1',
				},
			},
		);

		assert.equal(stderr, '');
		assert.match(stdout, new RegExp("test at with-fail.jsx:6:1"));
	});
});
