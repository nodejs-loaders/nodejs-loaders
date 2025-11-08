import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolve, load } from './yaml.loader.mjs';

describe('YAML loader', { concurrency: true }, () => {
	describe('resolve', () => {
		const nextResolve = async (specifier) => ({ url: specifier });

		for (const ext of ['yml', 'yaml']) {
			it(`should resolve a ".${ext}"`, async () => {
				const specifier = `./test.${ext}`;
				const ctx = {};

				const result = await resolve(specifier, ctx, nextResolve);
				assert.equal(result.format, 'yaml');
			});
		}

		it('should ignore a non-yaml file', async () => {
			const specifier = './test.txt';
			const ctx = {};

			const result = await resolve(specifier, ctx, nextResolve);
			assert.notEqual(result.format, 'yaml');
		});
	});

	describe('load', () => {
		const nextLoad = async (_url, _ctx) => ({ source: 'key: value' });

		it('should load and parse YAML content', async () => {
			const result = await load('./test.yaml', { format: 'yaml' }, nextLoad);
			assert.deepEqual(result.source, JSON.stringify({ key: 'value' }));
		});

		it('should not load non-yaml content', async () => {
			const url = './test.txt';
			const ctx = { format: 'text' };

			const result = await load(url, ctx, nextLoad);
			assert.equal(result.source, 'key: value');
		});

		it('should correctly parse complex YAML content', async () => {
			const url = './test.yaml';
			const ctx = { format: 'yaml' };
			const nextLoad = async (_url, _ctx) => ({
				source: [
					'key1: value1',
					'key2:',
					'  - item1',
					'  - item2',
					'key3:',
					'  subkey1: subvalue1',
					'  subkey2: subvalue2',
				].join('\n'),
			});

			const result = await load(url, ctx, nextLoad);
			assert.deepEqual(result.source, JSON.stringify({
				key1: 'value1',
				key2: ['item1', 'item2'],
				key3: {
					subkey1: 'subvalue1',
					subkey2: 'subvalue2',
				},
			}));
		});
	});
});
