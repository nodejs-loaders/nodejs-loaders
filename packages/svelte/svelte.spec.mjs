import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nextLoadAsync } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolveAsync } from '../../fixtures/nextResolve.fixture.mjs';

import { load, resolve } from './svelte.loader.mjs';

describe('svelte loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore non-svelte files', async () => {
			const result = await resolve(
				'../../fixtures/fixture.txt',
				{},
				nextResolveAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: '../../fixtures/fixture.txt',
			});
		});

		it('should recognise svelte files', async () => {
			const result = await resolve('./fixture.svelte', {}, nextResolveAsync);

			assert.deepEqual(result, {
				format: 'svelte',
				url: './fixture.svelte',
			});
		});
	});

	describe('load', () => {
		it('should ignore non-svelte files', async () => {
			const result = await load(
				import.meta.resolve('../../fixtures/fixture.ext'),
				{},
				nextLoadAsync,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should compile svelte files correctly', async (t) => {
			const fileUrl = import.meta.resolve('./fixture.svelte');
			const result = await load(fileUrl, { format: 'svelte' }, () => {
				return {
					source: '<script>export let name;</script><h1>Hello {name}!</h1>',
				};
			});

			t.assert.snapshot(result.source);
		});
	});
});
