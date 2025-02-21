import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import JSON5 from 'json5';

/** @typedef {import('../types.d.ts').FileURL} FileURL */

async function resolveJSON5(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	const ext = getFilenameExt(/** @type {FileURL} */ (nextResult.url));

	/**
	 * On Node.js v20, v22, v23 the extension **and** the `importAttributes`
	 * are needed to import correctly json files. So we want to have same
	 * behavior as Node.js.
	 */
	if (ext === '.json5' && ctx.importAttributes?.type === 'json5') {
		return {
			...nextResult,
			// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
			format: 'json5',
		};
	}

	return nextResult;
}
export { resolveJSON5 as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadJSON5(url, ctx, nextLoad) {
	const nextResult = await nextLoad(url, ctx);

	// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
	if (ctx.format !== 'json5') return nextResult;

	const data = JSON5.parse(String(nextResult.source));

	return {
		format: 'json',
		source: JSON.stringify(data),
	};
}
export { loadJSON5 as load };
