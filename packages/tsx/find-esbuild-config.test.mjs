import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

const skip = +process.version.slice(1, 3) < 23;

describe('finding an ESbuild config (e2e)', { skip }, () => {
	let defaults;
	let findEsbuildConfig;

	before(async () => {
		({ defaults, findEsbuildConfig } = await import(
			'./find-esbuild-config.mjs'
		));
	});

	it('should fail gracefully when no esbuild config is found', () => {
		const result = findEsbuildConfig(
			import.meta.resolve('./fixtures/no-config'),
		);

		assert.deepEqual(result, defaults);
	});
});
