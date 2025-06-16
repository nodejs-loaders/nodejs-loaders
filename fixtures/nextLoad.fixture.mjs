import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const nextLoadSync = (
	url,
	{ format = 'unknown' } = { format: 'unknown' },
) => {
	const fsPath = URL.canParse(url) ? fileURLToPath(url) : url;

	return {
		format,
		source: readFileSync(fsPath, 'utf8'),
	};
};

/**
 * @param  {Parameters<nextLoadSync>} args
 */
export const nextLoadAsync = async (...args) => nextLoadSync(...args);
