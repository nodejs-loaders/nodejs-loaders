import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadJSON5 } from "./json5.mjs";

describe("JSON5 Loader", () => {
	it("should correctly parse valid JSON5 content", () => {
		const source = `{ key: 'value', trailingComma: true, }`;
		const result = loadJSON5(source);
		assert.deepStrictEqual(result, { key: "value", trailingComma: true });
	});

	it("should throw an error for invalid JSON5 content", () => {
		const source = `{ key: 'value', invalidSyntax `;
		assert.throws(() => loadJSON5(source), /JSON5 parsing error/);
	});
});