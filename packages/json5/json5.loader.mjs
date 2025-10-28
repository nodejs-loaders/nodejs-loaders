import JSON5 from 'json5';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveJSON5(specifier, ctx, nextResolve) {
	const nextResult = nextResolve(specifier);

	return runForAsyncOrSync(nextResult, finaliseResolveJSON5, ctx);
}
export { resolveJSON5 as resolve };

/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveJSON5(resolvedResult, ctx) {
	const ext = getFilenameExt(/** @type {FileURL} */ (resolvedResult.url));

	/**
	 * On Node.js v20, v22, v23 the extension **and** the `importAttributes`
	 * are needed to import correctly json files. So we want to have same
	 * behavior as Node.js.
	 */
	if (ext === '.json5' && ctx.importAttributes?.type === 'json5') {
		return {
			...resolvedResult,
			format: 'json5',
		};
	}

	return resolvedResult;
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadJSON5(url, ctx, nextLoad) {
	const nextResult = nextLoad(url, ctx);

	return runForAsyncOrSync(nextResult, finaliseLoadJSON5, ctx.format);
}
export { loadJSON5 as load };

/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 * @param {import('node:module').LoadHookContext['format']} format The format hint.
 */
function finaliseLoadJSON5(loadedResult, format) {
	if (format !== 'json5') return loadedResult;

	const data = JSON5.parse(String(loadedResult.source));

	return {
		format: 'json',
		source: JSON.stringify(data),
	};
}
