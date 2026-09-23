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
 * Decodes a binary source as UTF-8. `ignoreBOM` keeps a leading byte order mark, matching what
 * reading the same file as text returns.
 * @type {TextDecoder}
 */
const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true });

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

	// Serialise the text instead of interpolating it into a template literal: backticks, `${…}`, and
	// backslash sequences in the file would otherwise run as JavaScript rather than import literally.
	const rawSource = loadedResult.source;
	const text = typeof rawSource === 'string'
		? rawSource
		: textDecoder.decode(rawSource ?? new Uint8Array());

	return {
		format: 'module',
		source: `export default ${JSON.stringify(text)};`,
	};
}

export const exts = {
	'.gql': 'graphql',
	'.graphql': 'graphql',
	'.md': 'markdown',
	'.txt': 'text',
};

export const formats = new Set(Object.values(exts));
