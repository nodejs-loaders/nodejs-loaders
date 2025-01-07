import path from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

import { transform } from 'esbuild';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

import { findEsbuildConfig } from './find-esbuild-config.mjs';

/**
 * The load hook needs to know the parent URL to find the esbuild config.
 * But load hooks don't have access to the parent URL.
 * If you try to pass it as return value from the resolve hook, it will be overwritten by node.
 *
 * @type {Map<URL['href'], URL['href']>}
 */
export const parentURLs = new Map();

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveTSX(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(nextResult.url);

	parentURLs.set(
		nextResult.url,
		ctx.parentURL ?? pathToFileURL(path.join(cwd(), 'whatever.ext')).href,
	);

	if (jsxExts.has(ext)) {
		return {
			...nextResult,
			// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
			format: 'jsx',
		};
	}

	if (tsxExts.has(ext)) {
		return {
			...nextResult,
			// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
			format: 'tsx',
		};
	}

	return nextResult;
}
export { resolveTSX as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadTSX(url, ctx, nextLoad) {
	if (!formats.has(ctx.format)) return nextLoad(url); // not (j|t)sx

	const format = 'module';
	const esbuildConfig = findEsbuildConfig(url, parentURLs.get(url));

	// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71492
	const nextResult = await nextLoad(url, {
		// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
		format,
	});
	let rawSource = `${nextResult.source}`; // byte array → string

	if (esbuildConfig.jsx === 'transform') {
		rawSource = `import * as React from 'react';\n${rawSource}`;
	}

	const { code: source, warnings } = await transform(
		rawSource,
		esbuildConfig,
	).catch(({ errors }) => {
		for (const {
			location: { column, line, lineText },
			text,
		} of errors) {
			console.error(
				`TranspileError: ${text}\n    at ${url}:${line}:${column}\n    at: ${lineText}\n`,
			);
		}

		return {
			code: null,
			warnings: [],
		};
	});

	if (warnings?.length) console.warn(...warnings);

	return {
		format,
		source,
	};
}
export { loadTSX as load };

export const jsxExts = new Set(['.jsx']);

export const tsxExts = new Set(['.mts', '.ts', '.tsx']);

const formats = new Set(['jsx', 'tsx']);
