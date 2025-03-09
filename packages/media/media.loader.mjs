import process from 'node:process';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';

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
 * @type {import('node:module').InitializeHook}
 * @param {object} [config={}]
 * @param {string[]} [config.additions] File extensions to add to the default list.
 * @param {string[]} [config.deletions] File extensions to remove from the default list.
 */
function initialiseMedia({ additions, deletions } = {}) {
	if (additions?.length) for (const a of additions) exts.add(a);
	if (deletions?.length) for (const r of deletions) exts.delete(r);
}
export { initialiseMedia as initialize };

const cwd = process.cwd();

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
