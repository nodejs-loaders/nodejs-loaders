import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { defaults, findEsbuildConfig } from './find-esbuild-config.mjs';

describe('finding an ESbuild config (e2e)', () => {
	it('should fail gracefully when no esbuild config is found', () => {
		const result = findEsbuildConfig(
			import.meta.resolve('./fixtures/no-config'),
		);

		assert.deepEqual(result, defaults);
	});
});
