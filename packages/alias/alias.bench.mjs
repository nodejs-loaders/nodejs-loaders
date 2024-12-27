import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../utils/spawn-promisified.mjs';

const suite = new Suite({
	reporter: chartReport
});

const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

suite.add('--loader', { repeatSuite: 2 }, async () => {
	await spawnPromisified(
		execPath,
		[
			'--no-warnings',
			'--loader',
			fileURLToPath(import.meta.resolve('./alias.mjs')),
			e2eTest,
		],
		{ cwd },
	);
});

suite.add('--import (register)', { repeatSuite: 2 }, async () => {
	await spawnPromisified(
		execPath,
		[
			'--no-warnings',
			'--import',
			fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
			e2eTest,
		],
		{ cwd },
	);
});

if (process.version.startsWith('v23')) {
	suite.add('--import (registerHooks)', { repeatSuite: 2 }, async () => {
		await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register-hooks.mjs')),
				e2eTest,
			],
			{ cwd },
		);
	});
}

suite.run();
