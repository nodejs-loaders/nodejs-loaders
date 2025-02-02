import JSON5 from 'json5';

export function loadJSON5(source) {
	try {
		const parsed = JSON5.parse(source);

		return parsed;
	} catch (error) {
		throw new Error(`JSON5 parsing error: ${error.message}`);
	}
}