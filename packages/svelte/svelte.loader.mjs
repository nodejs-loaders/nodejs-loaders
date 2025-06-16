/* @ts-self-types="./svelte.loader.d.mts" */
import { compile } from 'svelte/compiler';
import { stripExtras } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveSvelte(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	if (!stripExtras(specifier).endsWith('.svelte')) return nextResult;

	return {
		...ctx,

		format: 'svelte',
		url: nextResult.url,
	};
}
export { resolveSvelte as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadSvelte(url, ctx, nextLoad) {
	const nextResult = await nextLoad(url, ctx);

	if (ctx.format !== 'svelte') return nextResult;

	const rawSource = nextResult.source.toString();
	const compiled = compile(rawSource, {});

	return {
		format: 'module',
		source: compiled.js.code,
	};
}
export { loadSvelte as load };
