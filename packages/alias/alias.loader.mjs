// oxlint-disable eslint/max-depth

import { getAliases, meta } from './get-aliases-from-tsconfig.mjs';

/** @typedef {import('type-fest').TsConfigJson} TsConfigJson */
/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @typedef {object} AliasInitConfig
 * @prop {string | FileURL} AliasInitConfig.location The name or fully resolved location of the tsconfig.
 */
/**
 * @type {import('node:module').InitializeHook}
 * @param {AliasInitConfig} [config] Configuration object to customise Alias loader.
 */
function initialiseAlias(config) {
	if (config == null) return;

	if (config.location) meta.filename = config.location;
}
export { initialiseAlias as initialize };

/**
 * @typedef {import('node:module').ResolveHook} ResolveHook
 * @typedef {Parameters<ResolveHook>} ResolveParams
 * @typedef {ResolveParams[0]} ResolveSpecifier
 * @typedef {ResolveParams[1]} ResolveCtx
 */

/**
 * @type {import('node:module').ResolveHook}
 * @param {ResolveSpecifier} specifier The unresolved module specifier.
 * @param {ResolveCtx & { parentURL?: FileURL }} ctx The ResolveHookContext.
 */
function resolveAlias(specifier, ctx, next) {
	const aliases = getAliases(ctx.parentURL);

	if (!aliases) return next(specifier, ctx);

	return resolveAliases(specifier, {
		...ctx,
		// @ts-expect-error not sure why it isn't picking up the type union
		aliases,
	}, next);
}
export { resolveAlias as resolve };

/**
 * @type {import('node:module').ResolveHook}
 * @param {ResolveSpecifier} specifier The unresolved module specifier.
 * @param {ResolveCtx & { aliases: import('./get-aliases-from-tsconfig.mjs').AliasMap }} ctx The ResolveHookContext.
 */
export function resolveAliases(specifier, { aliases }, next) {
	for (const [key, dest] of aliases) {
		if (specifier === key) {
			return next(dest);
		}
		if (specifier.startsWith(key)) {
			let resolved;
			// Need try/catch for the sync path (module.registerHooks)
			try { resolved = next(specifier.replace(key, dest)) }
			catch (err) { if (err.code !== 'ERR_MODULE_NOT_FOUND') throw err }

			// Need the promise path for the async path (module.register)
			if (resolved instanceof Promise) {
				return resolved.catch((err) => {
					if (err.code !== 'ERR_MODULE_NOT_FOUND') throw err;

					return next(specifier);
				});
			}

			if (resolved) return resolved;

			return next(specifier);
		}
	}

	return next(specifier);
}
