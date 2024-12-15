import { createRequire, findPackageJSON } from 'node:module';
import { fileURLToPath } from 'node:url';

// This config must contain options that are compatible with esbuild's `transform` API.
export let esbuildConfig;

/**
 * @param {URL['href']} parentURL
 */
export function findEsbuildConfig(parentURL) {
  if (esbuildConfig != null) return esbuildConfig;

	const esBuildConfigLocus = findPackageJSON(parentURL)
		?.replace('package.json', 'esbuild.config.mjs');

	const req = createRequire(fileURLToPath(parentURL));
  try {
    esbuildConfig = req(esBuildConfigLocus)?.default;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;

    process.emitWarning('No esbuild config found in project root. Using default config.')
  }

  return esbuildConfig = Object.assign({}, defaults, esbuildConfig);
}

export const defaults = {
	jsx: 'automatic',
	jsxDev: true,
	jsxFactory: 'React.createElement',
	loader: 'tsx',
	minify: true,
};
