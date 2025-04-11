/**
 * @type {import('node:module').ResolveHook}
 */
function resolveNpmPrefix(specifier, ctx, nextResolve) {
	const cleanSpecifier = specifier.startsWith('npm:')
		// oxlint-disable-next-line no-magic-numbers
		? specifier.slice(4)
		: specifier;

	return nextResolve(cleanSpecifier, ctx);
}
export { resolveNpmPrefix as resolve };
