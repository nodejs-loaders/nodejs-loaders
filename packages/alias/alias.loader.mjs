import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, URL } from 'node:url';

const projectRoot = pathToFileURL(`${process.cwd()}/`);

const aliases = await readConfigFile('tsconfig.json');

if (!aliases)
	console.warn(
		'Alias loader was registered but no "paths" were found in tsconfig.json',
		'This loader will behave as a noop (but you should probably remove it if you aren’t using it).',
	);

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveAlias(specifier, ctx, next) {
	return (aliases ? resolveAliases : next)(specifier, ctx, next);
}
export { resolveAlias as resolve };

/**
 * @type {import('node:module').ResolveHook}
 */
export function resolveAliases(specifier, ctx, next) {
	// biome-ignore format: https://github.com/biomejs/biome/issues/4799
	for (const [key, dest] of /** @type {AliasMap} */ (aliases)) {
		if (specifier === key) {
			return next(dest, ctx);
		}
		if (specifier.startsWith(key)) {
			return next(specifier.replace(key, dest), ctx);
		}
	}

	return next(specifier, ctx);
}

export function readConfigFile(filename) {
	const filepath = path.join(projectRoot.pathname, filename);

	return (
		readFile(filepath)
			.then((contents) => contents.toString())
			.then((contents) => JSON.parse(contents))
			// Get the `compilerOptions.paths` object from the parsed JSON
			.then((contents) => contents?.compilerOptions?.paths)
			.then(buildAliasMaps)
			.catch((err) => {
				if (err.code !== 'ENOENT') throw err;
			})
	);
}

/**
 * @typedef {Map<string, string>} AliasMap
 */

function buildAliasMaps(config) {
	if (!config) return;

	// biome-ignore format: https://github.com/biomejs/biome/issues/4799
	const aliases = /** @type {AliasMap} */ (new Map());

	for (const rawKey of Object.keys(config)) {
		const alias = config[rawKey][0];
		const isPrefix = rawKey.endsWith('*');

		const key = isPrefix ? rawKey.slice(0, -1) /* strip '*' */ : rawKey;
		const baseDest = isPrefix ? alias.slice(0, -1) /* strip '*' */ : alias;
		const dest =
			baseDest[0] === '/' || URL.canParse(baseDest)
				? baseDest
				: new URL(baseDest, projectRoot).href;

		aliases.set(key, dest);
	}

	return aliases;
}
