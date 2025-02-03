import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const suite = new Suite({
	reporter: chartReport,
});

const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

suite.add('tsx with esbuild --loader', { repeatSuite: 2 }, () => {
	spawnSync(
		execPath,
		[
			'--no-warnings',
			'--loader',
			fileURLToPath(import.meta.resolve('./esbuild.mjs')),
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

suite.add('tsx with esbuild --import (register)', { repeatSuite: 2 }, () => {
	spawnSync(
		execPath,
		[
			'--no-warnings',
			'--import',
			fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
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

suite.add('tsx with oxc-transform --loader', { repeatSuite: 2 }, () => {
	spawnSync(
		execPath,
		[
			'--no-warnings',
			'--loader',
			fileURLToPath(import.meta.resolve('./oxc-transform.mjs')),
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

suite.add(
	'tsx with oxc-transform --import (register)',
	{ repeatSuite: 2 },
	() => {
		spawnSync(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
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
	},
);

suite.run();
