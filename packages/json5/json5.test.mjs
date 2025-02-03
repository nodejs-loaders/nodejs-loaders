import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadJSON5 } from './json5.mjs';

describe('JSON5 Loader', () => {
	it('should correctly parse valid JSON5 content', () => {
		const source = `{ key: 'value', trailingComma: true, }`;
		const result = loadJSON5(source);
		assert.deepStrictEqual(result, { key: 'value', trailingComma: true });
	});

	it('should throw a SyntaxError for invalid JSON5 content', () => {
		const source = `{ key: 'value', invalidSyntax `;
		assert.throws(() => loadJSON5(source), SyntaxError);
	});

	it('should throw an error for empty JSON5 content', () => {
		const source = ``;
		assert.throws(() => loadJSON5(source), SyntaxError);
	});

	it('should parse numbers and booleans correctly', () => {
		const source = `{ number: 42, isActive: true }`;
		const result = loadJSON5(source);
		assert.deepStrictEqual(result, { number: 42, isActive: true });
	});

	it('should parse nested objects correctly', () => {
		const source = `{ parent: { child: { key: 'value' } } }`;
		const result = loadJSON5(source);
		assert.deepStrictEqual(result, { parent: { child: { key: 'value' } } });
	});

	it('should parse arrays correctly', () => {
		const source = `{ items: [1, 2, 3, "four"] }`;
		const result = loadJSON5(source);
		assert.deepStrictEqual(result, { items: [1, 2, 3, 'four'] });
	});
});
