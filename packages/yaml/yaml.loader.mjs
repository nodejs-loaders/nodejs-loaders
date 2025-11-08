import { parse } from 'yaml';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveYaml(specifier, ctx, nextResolve) {
	return runForAsyncOrSync(
		nextResolve(specifier),
		finaliseResolveYaml,
		ctx,
	);
}
export { resolveYaml as resolve };
/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} _ctx Context about the module.
 */
function finaliseResolveYaml(resolvedResult, _ctx) {
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(/** @type {FileURL} */ (resolvedResult.url));

	if (ext === '.yaml' || ext === '.yml') {
		return {
			...resolvedResult,
			format: 'yaml',
		};
	}

	return resolvedResult;
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadYaml(url, ctx, nextLoad) {
	if (ctx.format !== 'yaml') return nextLoad(url);

	return runForAsyncOrSync(
		nextLoad(url, { format: 'module' }),
		finaliseLoadYaml,
		ctx,
	)
}
export { loadYaml as load };

/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 * @param {import('node:module').LoadHookContext} _ctx Context about the module being loaded.
 */
function finaliseLoadYaml(loadedResult, _ctx) {
	const rawSource = '' + loadedResult.source; // byte array → string

	const source = parse(rawSource);

	return {
		format: 'json',
		source: JSON.stringify(source),
	};
}
