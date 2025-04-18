import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import { parse } from 'yaml';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveYaml(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(/** @type {FileURL} */ (nextResult.url));

	if (ext === '.yaml' || ext === '.yml') {
		return {
			...nextResult,
			format: 'yaml',
		};
	}

	return nextResult;
}
export { resolveYaml as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadYaml(url, ctx, nextLoad) {
	if (ctx.format !== 'yaml') return nextLoad(url);

	const nextResult = await nextLoad(url, { format: 'module' });
	const rawSource = '' + nextResult.source; // byte array → string

	const source = parse(rawSource);

	return {
		format: 'module',
		source,
	};
}
export { loadYaml as load };
