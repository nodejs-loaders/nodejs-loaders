import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { containsCJS } from './contains-cjs.mjs';

describe('Contains CJS()', () => {
	describe('exports', () => {
		const matches = [
			'exports.foo =',
			'exports.foo=',
			'exports[something]=',
			'module.exports = chaiDom',
			'Object.defineProperty(exports,',
			'Object.assign(exports,',
		];

		it('should find assignments to `exports`', () => {
			for (const match of matches) {
				assert.ok(containsCJS(match), match);
			}
		});

		it('should NOT find `exports` in comments', () => {
			for (const match of matches) {
				const singleLineComment = `// something ${match} else`;
				assert.ok(containsCJS(singleLineComment) === false, singleLineComment);
				const blockComment = `* something ${match} else`;
				assert.ok(containsCJS(blockComment) === false, blockComment);
			}
		});
	});

	describe('require', () => {
		const bareMatches = ['require(foo)', "require('foo')"];
		const matches = [
			...bareMatches,
			"const foo = require('foo')",
			"  require('foo')",
			"		require('foo')",
		];

		it('should find calls to `require()`', () => {
			for (const match of matches) {
				assert.ok(containsCJS(match), match);
			}
		});

		it('should NOT find calls to methods named `require`', () => {
			for (const bareMatch of bareMatches) {
				const bareNonMatch = `bar.${bareMatch}`;
				assert.ok(containsCJS(bareNonMatch) === false, bareNonMatch);
			}
			assert.ok(containsCJS('const foo = bar.require(foo)') === false);
			assert.ok(containsCJS("const foo = bar.require('foo')") === false);
		});

		it('should NOT find `require` in comments', () => {
			for (const match of matches) {
				const singleLineComment = `// something ${match} else`;
				assert.ok(containsCJS(singleLineComment) === false, singleLineComment);
				const blockComment = `* something ${match} else`;
				assert.ok(containsCJS(blockComment) === false, blockComment);
			}
		});
	});
});
