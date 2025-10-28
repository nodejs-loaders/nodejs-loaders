// This loader provides a basic facsimile of CSS Modules intended for testing.
// Use something like esbuild to handle this in production.

import { parse } from 'postcss';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { stripExtras } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveCSSModule(specifier, ctx, nextResolve) {
	const nextResult = nextResolve(specifier);

	if (!stripExtras(specifier).endsWith('.module.css')) return nextResult;

	return runForAsyncOrSync(nextResult, finaliseResolveCSSModule, ctx);
}
export { resolveCSSModule as resolve };

/**
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 */
function finaliseResolveCSSModule(resolvedResult, ctx) {
	return {
		...ctx,
		format: 'css-module',
		url: resolvedResult.url,
	};
}

/**
 * @type {import('node:module').LoadHook}
 */
function loadCSSModule(url, ctx, nextLoad) {
	const nextResult = nextLoad(url, ctx);

	if (ctx.format !== 'css-module') return nextResult;

	return runForAsyncOrSync(nextResult, finaliseLoadCSSModule, ctx);
}
export { loadCSSModule as load };

/**
 * @param {import('node:module').LoadFnOutput} loadedResult Raw source has been retrieved.
 * @param {import('../types.js').FileURL} _url The fully resolved module location.
 */
function finaliseLoadCSSModule(loadedResult, _url) {
	const rawSource = '' + loadedResult.source;
	const parsed = parseCssToObject(rawSource);

	return {
		format: 'json',
		source: JSON.stringify(parsed),
	};
}

function parseCssToObject(rawSource) {
	const output = new Map(); // Map is best for mutation

	const postcssResult = parse(rawSource).toJSON();

	// @ts-ignore - postcss didn't have types for toJSON
	for (const rule of postcssResult.nodes) parseCssToObjectRecursive(rule, output);

	return Object.fromEntries(output);
}

function parseCssToObjectRecursive(node, output) {
	if (node.type === 'rule') {
		const classnames =
			node.selector.match(SELECTOR_TO_CLASS_NAME_RGX) ?? [];

		for (const classname of classnames) output.set(classname, classname);
	}

	if (node.nodes) for (const child of node.nodes) parseCssToObjectRecursive(child, output);
}

/**
 * Grab any classnames from a selector, which may have non-classnames anywhere within the selector.
 */
const SELECTOR_TO_CLASS_NAME_RGX = /(?<=\.)-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
