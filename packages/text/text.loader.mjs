import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveText(specifier, ctx, nextResolve) {
	return runForAsyncOrSync(
		nextResolve(specifier),
		finaliseResolveText,
		ctx,
	);
}
export { resolveText as resolve };

/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveText(resolvedResult, ctx) {
	const format = exts[getFilenameExt(/** @type {FileURL} */ (resolvedResult.url))];

	if (!format) return resolvedResult;

	return {
		...ctx,
		format,
		url: resolvedResult.url,
	};
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadText(url, ctx, nextLoad) {
	return runForAsyncOrSync(
		nextLoad(url),
		finaliseLoadText,
		ctx,
	);
}
export { loadText as load };

/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 * @param {import('node:module').LoadHookContext} ctx Context about the module being loaded.
 */
function finaliseLoadText(loadedResult, { format }) {
	if (!formats.has(format)) return loadedResult;

	const source = `export default \`${loadedResult.source}\`;`;

	return {
		format: 'module',
		source,
	};
}

export const exts = {
	'.gql': 'graphql',
	'.graphql': 'graphql',
	'.md': 'markdown',
	'.txt': 'text',
};

export const formats = new Set(Object.values(exts));
