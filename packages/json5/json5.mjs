import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import JSON5 from 'json5';

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
async function loadJSON5(url, ctx, nextLoad) {
	const urlStr = String(url);

	if (!urlStr.endsWith('.json5')) {
		return nextLoad(url);
	}


	const loaded = await nextLoad(url);

	if (options.format !== 'json5') {
		return loaded;
	}
	
		if (!loaded.source) {
		throw new SyntaxError(`Empty JSON5 file: ${url}`);
	}

	const json = JSON5.parse(String(loaded.source));

	return { source: JSON.stringify(json), format: 'json' };
}
export { loadJSON5 as load };
