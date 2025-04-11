import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const nextLoad = async (
	url,
	{ format = 'unknown' } = { format: 'unknown' },
) => {
	const fsPath = URL.canParse(url) ? fileURLToPath(url) : url;

	return {
		format,
		source: await readFile(fsPath, 'utf8'),
	};
};
