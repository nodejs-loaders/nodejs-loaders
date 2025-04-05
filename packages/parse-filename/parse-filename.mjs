import path from 'node:path';

/**
 * @typedef {import('../types.d.ts').AbsoluteFilePath} AbsoluteFilePath
 * @typedef {import('../types.d.ts').ResolvedSpecifier} ResolvedSpecifier
 */

/**
 * Some loaders may append query parameters or anchors (URLs allow that). That will dupe
 * path.extname, String::endsWith, etc.
 * @param {AbsoluteFilePath | ResolvedSpecifier} f The source to extract from.
 * @returns {string}
 */
export function getFilenameExt(f) {
	return path.extname(stripExtras(f));
}

/**
 * Remove query params and hashes from a file path or URL string.
 * @param {string} f The source to strip.
 */
export function stripExtras(f) {
	return f.split('?')[0].split('#')[0];
}

/**
 * @param {AbsoluteFilePath | ResolvedSpecifier} resolvedLocus A resolved location to pick apart.
 */
export function getFilenameParts(resolvedLocus) {
	const pathname = URL.canParse(resolvedLocus)
		? // biome-ignore format: we want to keep the parentheses
			/** @type {AbsoluteFilePath} */ ((new URL(resolvedLocus)).pathname)
		: resolvedLocus;

	const ext = getFilenameExt(pathname);
	const base = path.basename(pathname, ext);

	return {
		base,
		ext,
	};
}
