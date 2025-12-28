import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { spawnSync } from 'node:child_process';

const suite = new Suite({
	reporter: chartReport,
});

const e2eTest = './fixtures/e2e.mjs';

suite.add('--loader', { repeatSuite: 2 }, () => {
	spawnSync(execPath, ['--no-warnings', '--loader', './css-module.mjs', e2eTest]);
});

suite.add('--import (register)', { repeatSuite: 2 }, () => {
	spawnSync(execPath, [
		'--no-warnings',
		'--import',
		'./fixtures/register.mjs',
		e2eTest,
	]);
});

suite.add('--import (registerHooks)', { repeatSuite: 2 }, () => {
	spawnSync(execPath, [
		'--no-warnings',
		'--import',
		'./fixtures/register-hooks.mjs',
		e2eTest,
	]);
});

suite.run();
