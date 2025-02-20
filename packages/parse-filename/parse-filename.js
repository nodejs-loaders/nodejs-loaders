/* @ts-self-types="./parse-filename.d.ts" */
import path from 'node:path';

/**
 * Some loaders may append query parameters or anchors (URLs allow that). That will dupe
 * path.extname, String::endsWith, etc.
 * @param {string} f
 * @returns {string}
 */
export function getFilenameExt(f) {
	return path.extname(stripExtras(f));
}

/**
 * @param {string} f
 */
export function stripExtras(f) {
	return f.split('?')[0].split('#')[0];
}

/**
 * @param {`/${string}` | URL['href']} resolvedUrl
 */
export function getFilenameParts(resolvedUrl) {
	const pathname = URL.canParse(resolvedUrl)
		? // biome-ignore format: we want to keep the parentheses
			(new URL(resolvedUrl)).pathname
		: resolvedUrl;

	const ext = getFilenameExt(pathname);
	const base = path.basename(pathname, ext);

	return {
		base,
		ext,
	};
}
