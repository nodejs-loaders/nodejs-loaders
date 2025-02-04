/* @ts-self-types="./deno-npm-prefix.d.ts" */

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveNpmPrefix(specifier, ctx, nextResolve) {
	const cleanSpecifier = specifier.startsWith('npm:')
		? specifier.slice(4)
		: specifier;

	return nextResolve(cleanSpecifier, ctx);
}
export { resolveNpmPrefix as resolve };
