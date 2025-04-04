import process from 'node:process';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import { pathToFileURL } from 'node:url';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveMedia(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	if (!exts.has(getFilenameExt(/** @type {FileURL} */ (nextResult.url)))) {
		return nextResult;
	}

	return {
		...ctx,

		format: 'media',
		url: nextResult.url,
	};
}
export { resolveMedia as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadMedia(url, ctx, nextLoad) {
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
 * @param {MediaExtensionAddRemoveConfig|MediaExtensionReplacementConfig} config
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
 * @param {unknown} suspect
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
