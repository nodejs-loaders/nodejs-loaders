import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveMedia(specifier, ctx, nextResolve) {
	return runForAsyncOrSync(
		nextResolve(specifier),
		finaliseResolveMedia,
		ctx,
	);
}
export { resolveMedia as resolve };

/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveMedia(resolvedResult, ctx) {
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	if (!exts.has(getFilenameExt(/** @type {FileURL} */ (resolvedResult.url)))) {
		return resolvedResult;
	}

	return {
		...ctx,
		format: 'media',
		url: resolvedResult.url,
	};
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadMedia(url, ctx, nextLoad) {
	if (ctx.format !== 'media') return nextLoad(url);

	const source = `export default '${url.replace(cwd, '[…]')}';`;

	return {
		format: 'module',
		shortCircuit: true, // There's nothing else for another loader to do, so signal to stop.
		source,
	};
}
export { loadMedia as load };

/**
 * @typedef {Array<string>|Set<string>} FileExtensionsList
 *
 * @typedef {object} MediaExtensionAddRemoveConfig
 * @prop {FileExtensionsList} MediaExtensionAddRemoveConfig.additions A list of file extensions to add to the default list.
 * @prop {FileExtensionsList} MediaExtensionAddRemoveConfig.deletions A list of file extensions to remove from the default list.
 *
 * @typedef {FileExtensionsList} MediaExtensionReplacementConfig A list of file extensions to REPLACE the default list.
 */
/**
 * @type {import('node:module').InitializeHook}
 * @param {MediaExtensionAddRemoveConfig|MediaExtensionReplacementConfig} config Data to configure media loader file extensions.
 */
function initialiseMedia(config) {
	if (config == null) return;

	if (isList(config)) {
		exts.clear();
		for (const r of /** @type {Iterable} */ (config)) exts.add(r);
	}

	if ('additions' in config && isList(config.additions)) {
		for (const a of config.additions) exts.add(a);
	}
	if ('deletions' in config && isList(config.deletions)) {
		for (const d of config.deletions) exts.delete(d);
	}
}
export { initialiseMedia as initialize };

/**
 * @param {unknown} suspect The item to check.
 * @returns {boolean}
 */
const isList = (suspect) =>
	typeof suspect[Symbol.iterator] === 'function' &&
	(Array.isArray(suspect) || suspect instanceof Set);

const cwd = pathToFileURL(process.cwd()).pathname;

export const exts = new Set([
	/**
	 * A/V
	 */
	'.av1',
	'.mp3',
	'.mp4',
	'.ogg',
	'.webm',
	/**
	 * documents
	 */
	'.epub',
	'.pdf',
	/**
	 * images
	 */
	'.avif',
	'.gif',
	'.ico',
	'.jpeg',
	'.jpg',
	'.png',
	'.webp',
]);
