import { styleText } from 'node:util';
import oxc from 'oxc-transform';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('oxc-transform').JsxOptions}
 */
const default_jsx_options = {
	runtime: 'automatic',
	development: true,
};

/**
 * @type {import('oxc-transform').TypeScriptOptions}
 */
const default_typescript_options = {
	jsxPragma: 'React.createElement',
	jsxPragmaFrag: 'React.Fragment',
};

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveTSX(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	const ext = getFilenameExt(nextResult.url);

	if (ext === '.jsx') {
		return {
			...nextResult,
			// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
			format: 'jsx',
		};
	}

	if (ext === '.mts' || ext === '.ts' || ext === '.tsx') {
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
	// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
	if (ctx.format !== 'jsx' && ctx.format !== 'tsx') return nextLoad(url); // not (j|t)sx

	// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
	const nextResult = await nextLoad(url, {
		format: ctx.format,
	});
	const rawSource = `${nextResult.source}`; // byte array → string

	const transformed = oxc.transform('', rawSource, {
		lang: ctx.format,
		jsx: default_jsx_options,
		typescript: default_typescript_options,
	});

	if (transformed.errors.length > 0) {
		for (const error of transformed.errors) {
			console.error(`${styleText(['bold', 'red'], 'Error')}: ${error.message}`);
			if (error.labels && error.labels.length > 0) {
				for (const label of error.labels) {
					console.error(
						`  at ${styleText(['yellow'], `${label.start}-${label.end}`)}: ${label.message || ''}`,
					);
				}
			}
			if (error.helpMessage)
				console.info(
					`${styleText(['bold', 'cyan'], 'Help')}: ${error.helpMessage}`,
				);
		}
	}

	return {
		format: 'module',
		source: transformed.code,
	};
}
export { loadTSX as load };
