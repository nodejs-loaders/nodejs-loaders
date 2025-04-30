import { transform } from 'oxc-transform';
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveTSX(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(/** @type {FileURL} */(nextResult.url));

	if (ext === '.jsx') {
		return {
			...nextResult,
			format: 'jsx',
		};
	}

	if (ext === '.mts' || ext === '.cts' || ext === '.ts' || ext === '.tsx') {
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
 * @param {FileURL} url The fully resolved url.
 */
async function loadTSX(url, ctx, nextLoad) {
	if (ctx.format !== 'jsx' && ctx.format !== 'tsx') return nextLoad(url); // not (j|t)sx

	const lang = ctx.format;

	const nextResult = await nextLoad(url, {
		format: 'module',
	});
	let rawSource = `${nextResult.source}`; // byte array → string

	// @todo(@AugustinMauroy): create a function to reade the ``tsconfig.json` file
	/**
	 * @type {import('oxc-transform').TypeScriptOptions}
	 */
	const tsconfig = {};

	const { code, errors, map } = transform(url, rawSource, {
		lang,
		sourcemap: true,
		typescript: tsconfig,
	});

	if (errors.length > 0) {
		const formattedErrors = errors.map(err => {
			let message = `[${err.severity}] ${err.message}`;
			if (err.codeframe) {
				message += `\n${err.codeframe}`;
			}
			if (err.helpMessage) {
				message += `\nHelp: ${err.helpMessage}`;
			}
			return message;
		}).join('\n\n');

		const error = new Error(`Error transforming ${url}:\n${formattedErrors}`);
		error.name = 'OxcTransformError';
		throw error;
	}

	let finalSource = code;
	if (map) {
		const mapBase64 = Buffer.from(JSON.stringify(map)).toString('base64');
		finalSource += `\n//# sourceMappingURL=data:application/json;base64,${mapBase64}`;
	}

	return {
		format: 'module',
		source: finalSource,
	};
}
export { loadTSX as load };
