import stripJsonComments from 'strip-json-comments';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveJSONC(specifier, ctx, nextResolve) {
	return runForAsyncOrSync(
		nextResolve(specifier),
		finaliseResolveJSONC,
		ctx,
	);
}
export { resolveJSONC as resolve };
/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveJSONC(resolvedResult, ctx) {
	const ext = getFilenameExt(/** @type {FileURL} */ (resolvedResult.url));

	/**
	 * On Node.js v20, v22, v23 the extension **and** the `importAttributes`
	 * are needed to import correctly json files. So we want to have same
	 * behavior than Node.js.
	 */
	if (ext === '.jsonc' && ctx.importAttributes?.type === 'jsonc') {
		return {
			...resolvedResult,
			format: 'jsonc',
		};
	}

	return resolvedResult;
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadJSONC(url, ctx, nextLoad) {
	return runForAsyncOrSync(
		nextLoad(url, ctx),
		finaliseLoadJSONC,
		ctx.format,
	);
}
export { loadJSONC as load };

/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 * @param {import('node:module').LoadHookContext['format']} format The fully resolved module location.
 */
function finaliseLoadJSONC(loadedResult, format) {
	if (format !== 'jsonc') return loadedResult;

	const rawSource = '' + loadedResult.source; // byte array → string
	const stripped = stripJsonComments(rawSource);

	return {
		format: 'json',
		source: stripped,
	};
}
