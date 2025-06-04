import path from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

import { transformSync } from 'esbuild';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import { finishHookInAsyncOrSyncChain } from '@nodejs-loaders/chain-utils/finish-hook';

import { findEsbuildConfig } from './find-esbuild-config.mjs';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * The load hook needs to know the parent URL to find the esbuild config.
 * But load hooks don't have access to the parent URL.
 * If you try to pass it as return value from the resolve hook, it will be overwritten by node.
 *
 * @type {Map<FileURL, FileURL>}
 */
export const parentURLs = new Map();

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveTSX(specifier, ctx, nextResolve) {
	const nextResult = nextResolve(specifier);

	return finishHookInAsyncOrSyncChain(nextResult, finaliseResolveTSX, ctx);
}
export { resolveTSX as resolve };

/**
 *
 * @param {import('node:module').ResolveFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').ResolveHookContext} ctx Context about the module.
 * @returns
 */
function finaliseResolveTSX(resolvedResult, ctx) {
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(/** @type {FileURL} */ (resolvedResult.url));

	parentURLs.set(
		/** @type {FileURL} */ (resolvedResult.url),
		/** @type {FileURL} */ (ctx.parentURL ?? pathToFileURL(path.join(cwd(), 'whatever.ext')).href),
	);

	if (ext === '.jsx') {
		return {
			...resolvedResult,
			format: 'jsx',
		};
	}

	if (ext === '.mts' || ext === '.ts' || ext === '.tsx') {
		return {
			...resolvedResult,
			format: 'tsx',
		};
	}

	return resolvedResult;
}

/**
 * @type {import('node:module').LoadHook}
 * @param {FileURL} url The fully resolved url.
 */
function loadTSX(url, ctx, nextLoad) {
	if (ctx.format !== 'jsx' && ctx.format !== 'tsx') return nextLoad(url); // not (j|t)sx

	const format = 'module';

	const nextResult = nextLoad(url, { format });

	return finishHookInAsyncOrSyncChain(nextResult, finaliseLoadTSX, url);
}
export { loadTSX as load };

/**
 *
 * @param {import('node:module').LoadFnOutput} loadResult Raw source has been retrieved.
 * @param {FileURL} url The fully resolved module location.
 */
function finaliseLoadTSX({ format, source: rawSource }, url) {
	if (!rawSource) return { format, source: undefined };

	rawSource = `${rawSource}`; // byte array → string

	const esbuildConfig = findEsbuildConfig(url, parentURLs.get(url));

	if (esbuildConfig.jsx === 'transform') rawSource = `import * as React from 'react';\n${rawSource}`;

	/**
	 * @type {import('esbuild').TransformResult['code']}
	 */
	let source;
	/**
	 * @type {import('esbuild').TransformResult['warnings']}
	 */
	let warnings = [];

	try {
		({ code: source, warnings } = transformSync(rawSource, { sourcefile: url, ...esbuildConfig }));
	} catch (f) {
		if (!('errors' in f) || !('warnings' in f)) throw f;

		const failure = /** @type {import('esbuild').TransformFailure} */ (f);

		for (const {
			location: { column, line, lineText },
			text,
		} of failure.errors) {
			// oxlint-disable-next-line no-console
			console.error(`TranspileError: ${text}\n    at ${url}:${line}:${column}\n    at: ${lineText}\n`);
		}

		if (failure.warnings.length) warnings = failure.warnings;
	}

	// oxlint-disable-next-line no-console
	if (warnings?.length) console.warn(...warnings);

	return {
		format,
		source,
	};
}
