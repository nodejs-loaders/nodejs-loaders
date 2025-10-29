import { compile } from 'svelte/compiler';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { stripExtras } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveSvelte(specifier, ctx, nextResolve) {
	const nextResult = nextResolve(specifier);

	if (!stripExtras(specifier).endsWith('.svelte')) return nextResult;

	return runForAsyncOrSync(
		nextResult,
		finaliseResolveSvelte,
		ctx,
	);
}
export { resolveSvelte as resolve };

/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveSvelte(resolvedResult, ctx) {
	return {
		...ctx,

		format: 'svelte',
		url: resolvedResult.url,
	};
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadSvelte(url, ctx, nextLoad) {
	const nextResult = nextLoad(url, ctx);

	if (ctx.format !== 'svelte') return nextResult;

	return runForAsyncOrSync(
		nextResult,
		finaliseLoadSvelte,
	);
}
export { loadSvelte as load };


/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 */
function finaliseLoadSvelte(loadedResult) {
	const rawSource = loadedResult.source.toString();
	const compiled = compile(rawSource, {});

	return {
		format: 'module',
		source: compiled.js.code,
	};
}
