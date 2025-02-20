import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const suite = new Suite({
	reporter: chartReport,
});

const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.js'));

suite.add('--loader', { repeatSuite: 2 }, () => {
	spawnSync(
		execPath,
		[
			'--no-warnings',
			'--loader',
			fileURLToPath(import.meta.resolve('./svelte.js')),
			e2eTest,
		],
		{
			cwd,
			encoding: 'utf-8',
			env: {
				NODE_ENV: 'development',
			},
		},
	);
});

suite.add('--import (register)', { repeatSuite: 2 }, () => {
	spawnSync(
		execPath,
		[
			'--no-warnings',
			'--import',
			fileURLToPath(import.meta.resolve('./fixtures/register.js')),
			e2eTest,
		],
		{
			cwd,
			encoding: 'utf-8',
			env: {
				NODE_ENV: 'development',
			},
		},
	);
});

suite.run();
