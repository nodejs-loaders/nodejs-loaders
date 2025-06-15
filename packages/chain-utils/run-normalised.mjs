/**
 * @typedef {import('node:module').ResolveFnOutput} ResolveFnOutput
 * @typedef {import('node:module').LoadFnOutput} LoadFnOutput
 */

/**
 * Customization Hook chains can be either asynchronous or synchronous. This utility takes the result of the nextHook,
 * and runs the provided callback on it, abstracting away whether nextResult is a promise or a value.
 * @template {ResolveFnOutput | LoadFnOutput} NextResult
 * @param {NextResult | Promise<NextResult>} nextResult Either the raw result or a promise of it, depending on
 * the kind of chain (sync vs async).
 * @param {(r: NextResult, ...any) => NextResult} cb The function to handle the loaders own work once the raw
 * result is available.
 * @param  {...any} others Any other parameters (besides the raw result) to be passed to the
 * callback.
 */
export function runForAsyncOrSync(nextResult, cb, ...others) {
	if (isPromise(nextResult)) return nextResult.then((nextResult) => cb(nextResult, ...others));

	return cb(nextResult, ...others);
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
