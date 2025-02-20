import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { spawnSync } from 'node:child_process';

const suite = new Suite({
	reporter: chartReport,
});

const e2eTest = './fixtures/e2e.js';

suite.add('--loader', { repeatSuite: 2 }, () => {
	spawnSync(execPath, ['--no-warnings', '--loader', './alias.js', e2eTest]);
});

suite.add('--import (register)', { repeatSuite: 2 }, () => {
	spawnSync(execPath, [
		'--no-warnings',
		'--import',
		'./fixtures/register.js',
		e2eTest,
	]);
});

if (process.version.startsWith('v23')) {
	suite.add('--import (registerHooks)', { repeatSuite: 2 }, () => {
		spawnSync(execPath, [
			'--no-warnings',
			'--import',
			'./fixtures/register-hooks.js',
			e2eTest,
		]);
	});
}

suite.run();
