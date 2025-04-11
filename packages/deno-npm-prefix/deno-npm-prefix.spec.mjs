import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolve } from './deno-npm-prefix.loader.mjs';

describe('deno-npm-prefix', () => {
	describe('resolve', () => {
		it('should remove "npm:" prefix from specifier', async () => {
			const specifier = 'npm:lodash';
			const nextResolve = (cleanSpecifier, _ctx) => {
				assert.strictEqual(cleanSpecifier, 'lodash');
				return Promise.resolve({ url: `node_modules/${cleanSpecifier}` });
			};

			const result = await resolve(specifier, {}, nextResolve);
			assert.deepEqual(result, { url: 'node_modules/lodash' });
		});

		it('should pass through specifier without "npm:" prefix', async () => {
			const specifier = 'lodash';
			const nextResolve = (cleanSpecifier, _ctx) => {
				assert.strictEqual(cleanSpecifier, 'lodash');
				return Promise.resolve({ url: `node_modules/${cleanSpecifier}` });
			};

			const result = await resolve(specifier, {}, nextResolve);
			assert.deepEqual(result, { url: 'node_modules/lodash' });
		});

		it('should handle empty specifier', async () => {
			const specifier = '';
			const nextResolve = (cleanSpecifier, _ctx) => {
				assert.strictEqual(cleanSpecifier, '');
				return Promise.resolve({ url: '' });
			};

			const result = await resolve(specifier, {}, nextResolve);
			assert.deepEqual(result, { url: '' });
		});
	});
});
