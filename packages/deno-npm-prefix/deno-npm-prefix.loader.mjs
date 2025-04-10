/**
 * @type {import('node:module').ResolveHook}
 */
function resolveNpmPrefix(specifier, ctx, nextResolve) {
	const cleanSpecifier = specifier.startsWith('npm:')
		? specifier.slice(4) // oxlint-disable-line no-magic-numbers
		: specifier;

	return nextResolve(cleanSpecifier, ctx);
}
export { resolveNpmPrefix as resolve };
