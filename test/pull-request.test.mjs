import { equal, match } from 'node:assert/strict';
import { execPath } from 'node:process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from './spawn-promisified.js';

import { SUPPORTED_PREFIXES } from './pr-prefixes.js';

test('Pull Request checks', async (t) => {
	const encoding = 'utf8';
	const prTestPath = fileURLToPath(import.meta.resolve('./pull-request.mjs'));

	const cases = [];
	let i = 0;
	for (const prefix of SUPPORTED_PREFIXES) {
		cases[i++] = t.test(
			`should pass when ${prefix} is valid (1 scope)`,
			async () => {
				const { code, stderr } = await spawnPromisified(
					execPath,
					[prTestPath],
					{
						encoding,
						env: { PR_TITLE: `${prefix}(tsx): update …` },
					},
				);

				equal(stderr, '');
				equal(code, 0);
			},
		);

		cases[i++] = t.test(
			`should pass when ${prefix} is valid (2 scopes)`,
			async () => {
				const { code, stderr } = await spawnPromisified(
					execPath,
					[prTestPath],
					{
						encoding,
						env: { PR_TITLE: `${prefix}(tsx,yml): update …` },
					},
				);

				equal(stderr, '');
				equal(code, 0);
			},
		);

		cases[i++] = t.test(
			`should pass when ${prefix} is valid (N scopes)`,
			async () => {
				const { code, stderr } = await spawnPromisified(
					execPath,
					[prTestPath],
					{
						encoding,
						env: { PR_TITLE: `${prefix}(alias,tsx,yml): update …` },
					},
				);

				equal(stderr, '');
				equal(code, 0);
			},
		);

		cases[i++] = t.test(
			`should fail when ${prefix} is missing scope`,
			async () => {
				const { code, stderr } = await spawnPromisified(
					execPath,
					[prTestPath],
					{
						encoding,
						env: { PR_TITLE: `${prefix}: update …` },
					},
				);

				match(stderr, /AssertionError/);
				match(stderr, new RegExp(prefix));
				match(stderr, /pull request title/i);
				equal(code, 1);
			},
		);

		cases[i++] = t.test(
			`should fail when ${prefix} is misformatted scope`,
			async () => {
				const { code, stderr } = await spawnPromisified(
					execPath,
					[prTestPath],
					{
						encoding,
						env: { PR_TITLE: `${prefix}(tsx) update …` },
					},
				);

				match(stderr, /AssertionError/);
				match(stderr, new RegExp(prefix));
				match(stderr, /pull request title/i);
				equal(code, 1);
			},
		);
	}

	cases[i++] = t.test('should fail when prefix is unsupported', async () => {
		const prefix = 'foo';
		const { code, stderr } = await spawnPromisified(execPath, [prTestPath], {
			encoding,
			env: { PR_TITLE: `${prefix}(tsx): update …` },
		});

		match(stderr, /AssertionError/);
		match(stderr, new RegExp(prefix));
		match(stderr, /pull request title/i);
		for (const p of SUPPORTED_PREFIXES) match(stderr, new RegExp(p));
		equal(code, 1);
	});

	await Promise.all(cases);
});
