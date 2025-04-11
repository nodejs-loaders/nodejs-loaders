// This loader provides a basic facsimile of CSS Modules intended for testing.
// Use something like esbuild to handle this in production.

import { parse } from 'postcss';

import { stripExtras } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveCSSModule(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	if (!stripExtras(specifier).endsWith('.module.css')) return nextResult;

	return {
		...ctx,
		format: 'css-module',
		url: nextResult.url,
	};
}
export { resolveCSSModule as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadCSSModule(url, ctx, nextLoad) {
	const nextResult = await nextLoad(url, ctx);

	if (ctx.format !== 'css-module') return nextResult;

	const rawSource = '' + nextResult.source;
	const parsed = parseCssToObject(rawSource);

	return {
		format: 'json',
		source: JSON.stringify(parsed),
	};
}
export { loadCSSModule as load };

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
