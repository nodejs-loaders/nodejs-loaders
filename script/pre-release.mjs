/**
 * @example
 * node script/pre-release.mjs --w=alias --bump=patch
 */
import fs from 'node:fs/promises';
import { styleText, parseArgs } from 'node:util';
import path from 'node:path';
import SemVer from 'semver';

/**
 * @type {import('node:util').ParseArgsConfig}
 */
const config = {
	args: process.argv.slice(2),
	options: {
		workspace: {
			type: 'string',
			default: '',
		},
		w: {
			type: 'string',
			default: '',
		},
		// bump: "major" | "minor" | "patch"
		bump: {
			type: 'string',
			default: 'patch',
		},
	},
};

const { values } = parseArgs(config);
let w = values.workspace || values.w;
const bump = values.bump;

if (!w) {
	console.error(`${styleText(['red'], '✗')} Missing workspace`);
	process.exit(1);
}

if (w) {
	w = `${w}/`;
	w = w.replace('packages/', '');
}

if (!['major', 'minor', 'patch'].includes(bump)) {
	console.error(`${styleText(['red'], '✗')} Invalid bump`);
	process.exit(1);
}

try {
	const npm_file = path.resolve(`packages/${w}package.json`);
	const jsr_file = path.resolve(`packages/${w}jsr.json`);

	const npm_data = JSON.parse(await fs.readFile(npm_file, 'utf8'));
	const jsr_data = JSON.parse(await fs.readFile(jsr_file, 'utf8'));

	const new_npm_version = SemVer.inc(npm_data.version, bump);
	const new_jsr_version = SemVer.inc(jsr_data.version, bump);

	if (new_npm_version !== new_jsr_version) {
		console.error(`${styleText(['red'], '✗')} Version mismatch`);
		process.exit(1);
	}

	npm_data.version = new_npm_version;
	jsr_data.version = new_jsr_version;

	await fs.writeFile(npm_file, JSON.stringify(npm_data, null, 2));
	await fs.writeFile(jsr_file, JSON.stringify(jsr_data, null, 2));

	console.log(
		`${styleText(['green'], '✓')} Workspace updated with new version ${styleText(['cyan'], new_npm_version)}`,
	);
} catch (e) {
	console.error(`${styleText(['red'], '✗')} ${e.message}`);
	process.exit(1);
}
