import { createRequire, findPackageJSON } from 'node:module';
import { emitWarning } from 'node:process';

/** @typedef {import('esbuild').TransformOptions} ESBuildOptions */
/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * This config must contain options that are compatible with esbuild's `transform` API.
 * @private Exported for testing
 * @type {Map<FileURL, ESBuildOptions>}
 */
export const configs = new Map();

/**
 * @param {FileURL} target Where to start.
 * @param {FileURL} parentURL Relative to where.
 */
export function findEsbuildConfig(target, parentURL = target) {
	if (configs.has(target)) return configs.get(target);

	const esBuildConfigLocus = findPackageJSON(target, parentURL)?.replace(
		PJSON_FNAME,
		CONFIG_FNAME,
	);

	/** @type {ESBuildOptions} */
	let esbuildConfig;
	if (esBuildConfigLocus != null) {
		const req = createRequire(parentURL);
		try {
			esbuildConfig = req(esBuildConfigLocus)?.default;
		} catch (err) {
			if (err.code !== 'ENOENT' && err.code !== 'MODULE_NOT_FOUND') throw err;
		}
	}

	if (esbuildConfig == null) {
		emitWarning(
			`No esbuild config found for "${target}" relative to "${parentURL}"; using defaults.`,
		);
	}

	esbuildConfig = Object.assign({}, defaults, esbuildConfig);
	configs.set(target, esbuildConfig);

	return esbuildConfig;
}

const PJSON_FNAME = 'package.json';
const CONFIG_FNAME = 'esbuild.config.mjs';

/**
 * @type {ESBuildOptions}
 */
export const defaults = {
	jsx: 'automatic',
	jsxDev: true,
	jsxFactory: 'React.createElement',
	loader: 'tsx',
	minify: false, // reduce performance impact of the loader
	sourcemap: process.sourceMapsEnabled ? 'inline' : undefined,
};
