import _camelCase from 'lodash.camelcase';
import _upperFirst from 'lodash.upperfirst';

import { runForAsyncOrSync } from '@nodejs-loaders/chain-utils/run-normalised';
import { getFilenameParts } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

const nonWords = /[\W$]/;

/**
 * Read an SVG file (which is text) and build a react component that returns the SVG.
 * @type {import('node:module').LoadHook}
 * @param {FileURL} url The fully resolved url.
 */
function loadSVGX(url, ctx, nextLoad) {
	const { base, ext } = getFilenameParts(url);

	if (ext !== '.svg') return nextLoad(url);

	if (nonWords.test(base)) {
		throw new SyntaxError(
			[
				'Cannot generate jsx component name from filename',
				`"${base}"`,
				'as it contains character(s) illegal for JavaScript identifiers',
			].join(' '),
		);
	}

	const name = pascalCase(base);

	return runForAsyncOrSync(
		nextLoad(url, { ...ctx, format: 'text' }),
		finaliseLoadSVGX,
		ctx,
		name,
	);
}
export { loadSVGX as load };

/**
 * @param {import('node:module').LoadFnOutput} resolvedResult Specifier has been fully resolved.
 * @param {import('node:module').LoadHookContext} ctx Context about the module.
 * @param {string} name Name to use for the component (derived from file name).
 */
function finaliseLoadSVGX({ source: svg }, ctx, name) {
	const source = `export default function ${name}() { return (\n${svg}); }`;

	return {
		...ctx,
		format: 'jsx',
		source,
	};
}

/**
 * Convert a string to quasi-PascalCase.
 * @param {string} input The string to transform.
 * @returns {string} The transformed string.
 *
 * @example
 * foo-bar → FooBar
 * i/o stream → IOStream
 */
function pascalCase(input) {
	return _upperFirst(_camelCase(input));
}
