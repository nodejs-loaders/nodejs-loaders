import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import JSON5 from 'json5';

/** @typedef {import('esbuild').TransformOptions} ESBuildOptions */
/** @typedef {`file://${string}`} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveJSON5(specifier, ctx, nextResolve) {
	const resolved = await nextResolve(specifier);

	if (getFilenameExt(specifier) !== '.json5') {
		return resolved;
	}

	return { ...resolved, format: 'json5' };
}
export { resolveJSON5 as resolve };

/**
 * @type {import('node:module').LoadHook}
 * @argument {FileURL} url
 */
async function loadJSON5(url, options = {}, nextLoad = async () => ({})) {
	const urlStr = String(url);

	if (!urlStr.endsWith('.json5')) {
		return nextLoad(url);
	}

	if (typeof nextLoad !== 'function') {
		throw new TypeError(
			`Expected nextLoad to be a function, but received ${typeof nextLoad}`,
		);
	}

	const loaded = await nextLoad(url);

	if (!loaded.source) {
		throw new SyntaxError(`Empty JSON5 file: ${url}`);
	}

	if (options.format !== 'json5') {
		return loaded;
	}

	const json = JSON5.parse(String(loaded.source));

	return { source: JSON.stringify(json), format: 'json' };
}
export { loadJSON5 as load };
