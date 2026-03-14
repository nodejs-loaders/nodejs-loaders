/**
 * @typedef {import('node:module').ResolveFnOutput} ResolveFnOutput
 * @typedef {import('node:module').LoadFnOutput} LoadFnOutput
 */

/**
 * @template {ResolveFnOutput | LoadFnOutput} Result
 * @param {Result | Promise<Result>} result Either the raw result or a promise of it, depending on
 * the kind of chain (sync vs async).
 * @param {(r: Result, ...any) => Result} cb A function to handle the loaders own work once the raw
 * result is available.
 * @param  {...any} extras Any other parameters (besides the raw result) to be passed to the
 * callback.
 */
export function finishHookInAsyncOrSyncChain(result, cb, ...extras) {
	if (isPromise(result)) return result.then((nextResult) => cb(nextResult, ...extras));

	return cb(result, ...extras);
}

/**
 * @template {{}} V
 * @param {V | Promise<V>} val The value to test.
 * @returns {val is Promise<V>}
 */
const isPromise = (val) => (
	val
	&& 'then' in val
	&& typeof val.then === 'function'
);
