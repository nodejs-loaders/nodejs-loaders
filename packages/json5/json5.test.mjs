import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { load } from './json5.mjs';

async function simulateLoad(source) {
	const url = pathToFileURL('test.json5');
	return await load(url, { format: 'json5' }, async () => ({
		source: source,
		format: 'json5',
	}));
}

describe('JSON5 Loader', () => {
	it('should correctly parse valid JSON5 content', async () => {
		const source = `{ key: 'value', trailingComma: true, }`;
		const result = await simulateLoad(source);
		assert.deepStrictEqual(JSON.parse(result.source), {
			key: 'value',
			trailingComma: true,
		});
	});

	it('should throw a SyntaxError for invalid JSON5 content', async () => {
		const source = `{ key: 'value', invalidSyntax `;
		await assert.rejects(() => simulateLoad(source), SyntaxError);
	});

	it('should throw an error for empty JSON5 content', async () => {
		const source = '';
		await assert.rejects(() => simulateLoad(source), SyntaxError);
	});

	it('should parse numbers and booleans correctly', async () => {
		const source = '{ number: 42, isActive: true }';
		const result = await simulateLoad(source);
		assert.deepStrictEqual(JSON.parse(result.source), {
			number: 42,
			isActive: true,
		});
	});

	it('should parse nested objects correctly', async () => {
		const source = "{ parent: { child: { key: 'value' } } }";
		const result = await simulateLoad(source);
		assert.deepStrictEqual(JSON.parse(result.source), {
			parent: { child: { key: 'value' } },
		});
	});

	it('should parse arrays correctly', async () => {
		const source = `{ items: [1, 2, 3, "four"] }`;
		const result = await simulateLoad(source);
		assert.deepStrictEqual(JSON.parse(result.source), {
			items: [1, 2, 3, 'four'],
		});
	});
});
