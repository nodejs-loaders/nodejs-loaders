// oxlint-disable no-console

/**
 * This script is used to run all the benchmarks in the project.
 * @see https://github.com/RafaelGSS/bench-node
 */
import { spawnSync } from 'node:child_process';
import { styleText, parseArgs } from 'node:util';
import { globSync } from 'node:fs';

/**
 * @type {import('node:util').ParseArgsConfig}
 */
const options = {
	workspace: {
		type: 'string',
		default: '',
	},
	w: {
		type: 'string',
		default: '',
	},
};

const { values } = parseArgs({ args: process.argv.slice(2), options });
let w = values.workspace || values.w;

if (w) {
	w = `${w}/`;
	w = w.replace('packages/', '');
}

const glob = `packages/${w}**/**.bench.{js,mjs}`;
const files = globSync(glob);

if (files.length === 0) {
	throw new Error(
		`${styleText(['red'], '✕')} No benchmarks found\nFor blobs: ${glob}`,
	);
}

console.log(`${styleText(['green'], '✓')} Found ${files.length} benchmarks`);

for (const file of files) {
	console.log(`${styleText(['blue'], 'ℹ')} Running ${file}`);
	const proc = spawnSync('node', ['--allow-natives-syntax', file], {
		stdio: 'inherit',
	});

	if (proc.status === 0) {
		console.log(`${styleText(['green'], '✓')} Successfully ran ${file}\n`);
	} else {
		console.error(`${styleText(['red'], '✕')} Failed to run ${file}\n`);
	}
}
