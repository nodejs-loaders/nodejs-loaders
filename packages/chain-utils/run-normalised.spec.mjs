import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { runForAsyncOrSync } from './run-normalised.mjs';

describe('Chain utils: Run For Async Or Sync', { concurrency: true }, () => {
	describe('async chain', () => {
		it('should call the callback with the value nextResult settled to', async () => {
			const val = { url: 'file:///tmp/test.mjs' };
			const cb = mock.fn();
			await runForAsyncOrSync(Promise.resolve(val), cb);

			assert.equal(cb.mock.calls[0].arguments[0], val);
		});

		it('should call the callback with the additional arguments provided', async () => {
			const other1 = 'foo';
			const other2 = 'bar';
			const cb = mock.fn();
			await runForAsyncOrSync(Promise.resolve(), cb, other1, other2);

			const spiedArgs = cb.mock.calls[0].arguments

			assert.equal(spiedArgs[1], other1, '1st arg');
			assert.equal(spiedArgs[2], other2, '2nd arg');
			assert.equal(spiedArgs[3], true, 'wasPromise');
		});
	});

	describe('sync chain', () => {
		it('should call the callback with the value of nextResult', () => {
			const val = { url: 'file:///tmp/test.mjs' };
			const cb = mock.fn();
			runForAsyncOrSync(val, cb);

			assert.equal(cb.mock.calls[0].arguments[0], val);
		});

		it('should call the callback with the additional arguments provided', () => {
			const other1 = 'foo';
			const other2 = 'bar';
			const cb = mock.fn();
			runForAsyncOrSync(null, cb, other1, other2);

			const spiedArgs = cb.mock.calls[0].arguments

			assert.equal(spiedArgs[1], other1, '1st arg');
			assert.equal(spiedArgs[2], other2, '2nd arg');
			assert.equal(spiedArgs[3], false, 'wasPromise');
		});
	});
});
