import path from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

import { transform } from 'esbuild';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

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
async function resolveTSX(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(/** @type {FileURL} */ (nextResult.url));

	parentURLs.set(
		// biome-ignore format: https://github.com/biomejs/biome/issues/4799
		/** @type {FileURL} */ (nextResult.url),
		// biome-ignore format: https://github.com/biomejs/biome/issues/4799
		/** @type {FileURL} */ (ctx.parentURL ?? pathToFileURL(path.join(cwd(), 'whatever.ext')).href),
	);

	if (ext === '.jsx') {
		return {
			...nextResult,
			format: 'jsx',
		};
	}

	if (ext === '.mts' || ext === '.ts' || ext === '.tsx') {
		return {
			...nextResult,
			format: 'tsx',
		};
	}

	return nextResult;
}
export { resolveTSX as resolve };

/**
 * @type {import('node:module').LoadHook}
 * @argument {FileURL} url
 */
async function loadTSX(url, ctx, nextLoad) {
	if (ctx.format !== 'jsx' && ctx.format !== 'tsx') return nextLoad(url); // not (j|t)sx

	const format = 'module';
	const esbuildConfig = findEsbuildConfig(url, parentURLs.get(url));

	const nextResult = await nextLoad(url, {
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
