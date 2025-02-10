import { getFilenameExt } from '@nodejs-loaders/parse-filename';

import { containsCJS } from './contains-cjs.mjs';

/**
 * This loader attempts to detect and override misconfigured packages, such as those that declare
 * themselves as ESM but are actually CJS, and vice versa.
 * @type {import('node:module').LoadHook}
 */
async function loadMismatchedFormat(url, ctx, next) {
	if (!exts.has(getFilenameExt(url))) return next(url);

	// Ensure the ESMLoader is used to read the contents.
	// It may throw, in which case we'll probably get a telling error we can use to know it was CJS.
	return (
		next(url, { ...ctx, format: 'module' })
			// the fact that this function is async for this to be used in `module.register`
			// @ts-ignore - so then is needed and `next()` can't be sync
			.then((result) => {
				if (containsCJS('' + result.source)) {
					throw new Error('CommonJS');
				}

				return result;
			})
			.catch(async (err) => {
				if (
					(err?.message.includes('require') &&
						err?.message.includes('import')) ||
					err?.message.includes('CommonJS')
				) {
					return { format: 'commonjs' };
				}

				throw err;
			})
	);
}
export { loadMismatchedFormat as load };

const exts = new Set(['.js']);
