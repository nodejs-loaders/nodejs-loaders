import { readFileSync } from 'node:fs';
import { findPackageJSON } from 'node:module';
import path from 'node:path';
import { emitWarning, env } from 'node:process';
import { pathToFileURL, URL } from 'node:url';

import JSON5 from 'json5';

/**
 * @typedef {import('type-fest').TsConfigJson} TSConfig
 * @typedef {import('../types.d.ts').AbsoluteFilePath} AbsoluteFilePath
 * @typedef {import('../types.d.ts').FileURL} FileURL
 */

export const meta = {
	filename: env.TS_NODE_PROJECT
		// oxlint-disable-next-line eslint/no-nested-ternary
		? env.TS_NODE_PROJECT?.startsWith('file:')
			? env.TS_NODE_PROJECT
			: pathToFileURL(path.resolve(env.TS_NODE_PROJECT)).href
		: 'tsconfig.json',
};

/**
 * @typedef {Map<string, string>} AliasMap A map of resolved aliases.
 */

/**
 * @type {Map<FileURL, AliasMap>}
 */
const aliasesMap = new Map();

/**
 * @param {FileURL} parentURL Relative to where.
 * @param {string} [filename] Filename or fully resolved location of the tsconfig.
 */
export function getAliases(
	parentURL,
	filename = meta.filename,
) {
	if (!parentURL) return; // "resolving" the entry-point (it's already resolved)

	const tsConfigLocus = /** @type {FileURL} */ (
		filename.startsWith('file:')
			? filename
			: pathToFileURL(findPackageJSON('./', parentURL)?.replace(
				PJSON_FNAME,
				path.basename(filename),
			))
	);

	if (aliasesMap.has(tsConfigLocus)) return aliasesMap.get(tsConfigLocus);

	const aliases = readConfigFile(tsConfigLocus);

	if (aliases == null) {
		emitWarning([
			`Alias loader was registered but no "paths" were found in "${filename}" for "${parentURL}".`,
			'This loader will behave as a noop (but you should probably remove it if you aren’t using it).',
		].join(''));
	}

	aliasesMap.set(tsConfigLocus, aliases);

	return aliases;
}
const PJSON_FNAME = 'package.json';

/**
 * @param {FileURL} resolvedLocus The resolved location of the tsconfig file.
 */
export function readConfigFile(resolvedLocus) {
	const fileURL = new URL(resolvedLocus); // URL for cross-compatibility with Windows

	let contents;
	try {
		contents = readFileSync(fileURL, 'utf8');
	} catch (err) {
		if (err.code !== 'ENOENT' && err.code !== 'MODULE_NOT_FOUND') throw err;
	}

	if (!contents) return;

	const tspaths = /** @type {TSConfig} */ (JSON5.parse(contents)).compilerOptions?.paths;

	return buildAliasMaps(tspaths, resolvedLocus);
}

/**
 * @param {TSConfig['compilerOptions']['paths']|undefined} tspaths The value of "paths" if it exists.
 * @param {FileURL} tsConfigLocus The location of the controlling tsconfig.
 */
function buildAliasMaps(tspaths, tsConfigLocus) {
	if (!tspaths) return;

	const aliases = /** @type {AliasMap} */ (new Map());

	for (const rawKey of Object.keys(tspaths)) {
		const alias = tspaths[rawKey][0];
		const isPrefix = rawKey.endsWith('*');

		const key = isPrefix ? rawKey.slice(0, -1) /* strip '*' */ : rawKey;
		const baseDest = isPrefix ? alias.slice(0, -1) /* strip '*' */ : alias;
		const dest = (baseDest[0] === '/' || URL.canParse(baseDest))
			? baseDest
			: new URL(baseDest, tsConfigLocus).href;

		aliases.set(key, dest);
	}

	return aliases;
}
