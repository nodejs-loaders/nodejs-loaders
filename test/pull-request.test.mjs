import { equal, match } from 'node:assert/strict';
import { execPath } from 'node:process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from './spawn-promisified.mjs';

import { PREFIXES } from './pr-prefixes.mjs';

test('Pull Request checks', async (t) => {
	const encoding = 'utf-8';
	const prTestPath = fileURLToPath(import.meta.resolve('./pull-request.mjs'));

	const cases = [];
	let i = 0;
	for (const prefix of PREFIXES) {
		cases[i++] = t.test(`should pass when ${prefix} is valid (1 scope)`, async () => {
			const { code, stderr } = await spawnPromisified(
				execPath,
				[
					prTestPath,
					'--title',
					`${prefix}(tsx): update …`,
				],
				{ encoding },
			);

			equal(stderr, '');
			equal(code, 0);
		});

		cases[i++] = t.test(`should pass when ${prefix} is valid (2 scopes)`, async () => {
			const { code, stderr } = await spawnPromisified(
				execPath,
				[
					prTestPath,
					'--title',
					`${prefix}(tsx,yml): update …`,
				],
				{ encoding },
			);

			equal(stderr, '');
			equal(code, 0);
		});

		cases[i++] = t.test(`should pass when ${prefix} is valid (N scopes)`, async () => {
			const { code, stderr } = await spawnPromisified(
				execPath,
				[
					prTestPath,
					'--title',
					`${prefix}(alias,tsx,yml): update …`,
				],
				{ encoding },
			);

			equal(stderr, '');
			equal(code, 0);
		});

		cases[i++] = t.test(`should fail when ${prefix} is missing scope`, async () => {
			const { code, stderr } = await spawnPromisified(
				execPath,
				[
					prTestPath,
					'--title',
					`${prefix}: update …`,
				],
				{ encoding },
			);

			match(stderr, /AssertionError/);
			match(stderr, new RegExp(prefix));
			match(stderr, /pull request title/i);
			equal(code, 1);
		});

		cases[i++] = t.test(`should fail when ${prefix} is misformatted scope`, async () => {
			const { code, stderr } = await spawnPromisified(
				execPath,
				[
					prTestPath,
					'--title',
					`${prefix}(tsx) update …`,
				],
				{ encoding },
			);

			match(stderr, /AssertionError/);
			match(stderr, new RegExp(prefix));
			match(stderr, /pull request title/i);
			equal(code, 1);
		});
	}

	cases[i++] = t.test('should fail when prefix is unsupported', async () => {
		const prefix = 'foo';
		const { code, stderr } = await spawnPromisified(
			execPath,
			[
				prTestPath,
				'--title',
				`${prefix}(tsx): update …`,
			],
			{ encoding },
		);

		match(stderr, /AssertionError/);
		match(stderr, new RegExp(prefix));
		match(stderr, /pull request title/i);
		for (const p of PREFIXES) match(stderr, new RegExp(p));
		equal(code, 1);
	});

	await Promise.all(cases);
});
