// oxlint-disable no-console

// This script is used to run all the benchmarks in the project.
// https://github.com/RafaelGSS/bench-node

import { globSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { styleText, parseArgs } from 'node:util';

let { workspace: w } = parseArgs({
	// oxlint-disable-next-line no-magic-numbers
	args: process.argv.slice(2),
	options: {
		workspace: {
			default: '',
			short: 'w',
			type: 'string',
		},
	},
}).values;

if (w) {
	w = `${w.replace('packages/', '')}/`;
}

const glob = `packages/${w}**/**.bench.{js,mjs}`;
const files = globSync(glob);

if (files.length === 0) {
	throw new Error(`${styleText(['red'], '✕')} No benchmarks found\nFor blobs: ${glob}`);
}

console.log(`${styleText(['green'], '✓')} Found ${files.length} benchmarks`);

for (const file of files) {
	console.log(`${styleText(['blue'], 'ℹ')} Running ${file}`);
	const { status } = spawnSync('node', ['--allow-natives-syntax', file], { stdio: 'inherit' });

	if (status === 0) {
		console.log(`${styleText(['green'], '✓')} Successfully ran ${file}\n`);
	} else {
		console.error(`${styleText(['red'], '✕')} Failed to run ${file}\n`);
	}
}
