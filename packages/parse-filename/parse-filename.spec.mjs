import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	getFilenameExt,
	getFilenameParts,
	stripExtras,
} from './parse-filename.mjs';

describe('parse-filename', () => {
	const base = 'foo';
	const ext = '.ext';

	describe('getFilenameExt', () => {
		it('should handle a simple file URL string', () => {
			const result = getFilenameExt(`file:///tmp/foo.bar${ext}`);

			assert.equal(result, ext);
		});

		it('should handle a file URL string with query params', () => {
			const result = getFilenameExt(`file:///tmp/foo.bar${ext}?hello=world`);

			assert.equal(result, ext);
		});

		it('should handle a file URL string with a hash', () => {
			const result = getFilenameExt(`file:///tmp/foo.bar${ext}#hello=world`);

			assert.equal(result, ext);
		});

		it('should handle a simple file path', () => {
			const result = getFilenameExt(`/tmp/foo.bar${ext}`);

			assert.equal(result, ext);
		});
	});

	describe('getFilenameParts', () => {
		const expectedResult = { base, ext };

		it('should handle an absolute file path', () => {
			const result = getFilenameParts(`/tmp/${base}${ext}`);

			assert.deepEqual(result, expectedResult);
		});

		it('should handle a file URL string', () => {
			const result = getFilenameParts(`file:///tmp/${base}${ext}`);

			assert.deepEqual(result, expectedResult);
		});
	});

	describe('stripExtras', () => {
		it('should remove query params', () => {
			const result = stripExtras(`${base}?hello=world`);

			assert.equal(result, base);
		});

		it('should remove hashes', () => {
			const result = stripExtras(`${base}#hello=world`);

			assert.equal(result, base);
		});
	});
});
