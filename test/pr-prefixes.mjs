export const SCOPE_RGX = /^\w+\([\w\-\d]*(?:,[\w\d-]*)*\): /;

/**
 * The subset of conventional commit prefixes used in this project.
 */
export const SUPPORTED_PREFIXES = [
	'doc',
	'dep',
	'fix',
	'feat',
	'release',
	'setup',
	'test',
];
