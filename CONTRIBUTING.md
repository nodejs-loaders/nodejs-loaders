# Nodejs Loaders Contributing Guide

Thank you for considering contributing to Node.js Loaders! Contributions welcome, be they bug reports, feature requests, pull requests, or just questions.

## Getting started

Commands specifically relevant to this project are:

Run the tests:
```bash
node --run test
```

Alternatively, run the tests for a specific loader:
```bash
npm run test --workspace=packages/LOADER_NAME_HERE
```

Lint, format, and check types:
```bash
node --run pre-commit
```

## Authoring

Code should be well documented and tested. Each loader must:

* Document for users via its own README
* Document for developers via code comments
* [Type-check via jsdoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
* Cover at least 90% of code between unit and end-to-end tests
  * unit tests for branching and especially failure cases
  * end-to-end for [happy-paths](https://en.wikipedia.org/wiki/Happy_path)
* Adhere to code styles (CI will verify adherence but will not auto-fix).

We take pride in this project. That said, we're pretty reasonable and friendly people; if there is a very good reason for something, make an objective case. But please also realise that our time is limited and this is not our job.

### Introducing a New Loader

If you want to introduce a new loader, please follow the steps below:

1. Open an issue to discuss the new loader
   1. Describe the use case for the new loader
	 1. What problem does it solve?
	 1. What are the benefits of the new loader?
	 1. Which dependencies will be required?
1. Once the issue is approved, make changes to the codebase
1. Open a pull request
1. Once the pull request is approved, the new loader will be merged
1. Realease!

#### Add the directory

Create a new directory in the `packages` directory with the name of the loader

#### Add a `package.json` file

```json
{
  "version": "1.0.0",
  "name": "@nodejs-loaders/YOUR-LOADER",
  "description": "Extend node to support YOUR THING via customisation hooks.",
  "type": "module",
  "main": "./YOUR-LOADER.mjs",
  "types": "./YOUR-LOADER.d.mts",
  "author": "YOUR NAME",
  "license": "ISC",
  "maintainers": [
    "Augustin Mauroy",
    "Jacob Smith"
  ],
  "keywords": [
    "customisation hook",
    "loader",
    "node",
    "node.js"
  ],
  "engines": {
    "node": ">=18"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nodejs-loaders/nodejs-loaders.git",
    "directory": "packages/YOUR-LOADER"
  }
}
```

> [!NOTE]
> Types are automatically generated from jsdocs during publication. Presumptively set the `"types"` field in package.json so they can be found (it's much easier than programmatically updating package.json).

CI will validate `package.json`, providing detailed errors if something is wrong.

#### Create the loader

Loaders leverage [customization hooks](https://nodejs.org/api/module.html#customization-hooks) to be able to customise/extend node. Exported names must match customization hook names; that's not terribly helpful in a stacktrace, so to aid debugging, it's kinder to give the hook a more descriptive name (`<load|resolve>MyThing`), and then alias (`export { resolveMyThing as resolve }`) it to an expected name so node understands what it is.

```js
/**
 * @type {import('node:module').ResolveHook}
 */
function resolveMyThing(specifier, ctx, nextResolve) {
	/* Do some awesome stuff */
}
export { resolveMyThing as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
function loadMyThing(url, ctx, nextLoad) {
	/* Do some awesome stuff */
}
export { loadMyThing as load };
```

### Security

Loaders making their own network calls (not just facilitating a user-specified call) will almost surely be rejected. For example, an `https` loader that facilitates `import foo from 'https://example.com/foo'` is okay. A loader fetching its own configuration file from a hard-coded `fetch('https://random.com/config')` is not okay.

### Tests

There are two part of testing: unit tests and end-to-end tests.

First write unit tests for your hooks via [`node:test`](https://nodejs.org/api/test.html), to validate the individual logic with your hooks. Unit tests should follow the naming convention `your-loader.spec.mjs`. And the test file should be co-located (in the same directory) with the loader; there is a separate `test` directory in the repo root—these are not the droids you're looking for (mostly ignore that directory).

The high-level structure of a unit test looks like:

```js
import assert from 'node:assert/strict';
import { describe it } from 'node:test';

import { resolve, load } from './your-loader.mjs';

describe('Your Loader', () => {
	describe('resolve', () => {
		it('should resolve the specifier', () => {
			/* Test your resolve hook */
		});
	});

	describe('load', () => {
		it('should load the module', () => {
			/* Test your load hook */
		});
	});
});
```

Second, write end-to-end (e2e / E2E) tests. These prove the loader works IRL. End-to-end tests should follow the naming convention `your-loader.test.mjs`.

```js
import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('Your Loader (e2e)', () => {
	const opts = {
		cwd: fileURLToPath(import.meta.resolve('./fixtures')),
		encoding: 'utf-8',
	};
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

	it('should work with `--loader`', async (t) => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./your-loader.mjs')),
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, ''); // ! Check this first
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	it('should work with `module.register`', () => {
		const { code, stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
				e2eTest,
			],
			opts,
		);

		assert.equal(stderr, ''); // ! Check this first
		t.assert.snapshot(stdout);
		assert.equal(code, 0);
	});

	// This is not always (probably, rarely) applicable, so likely you would skip this one
	if (process.version.slice(1,3) >= 23) { // module.registerHooks only exists in v23+
		it('should work with `module.registerHooks`', async (t) => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
					e2eTest,
				],
				opts,
			);

			assert.equal(stderr, ''); // ! Check this first
			t.assert.snapshot(stdout);
			assert.equal(code, 0);
		});
	}
});
```

## Pull Requests

Changes should be atomic; do not combine multiple, discrete changes within a single PR.

We use [squash merge](https://docs.github.com/en/enterprise-cloud@latest/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#merge-message-for-a-squash-merge) to create a single fresh commit based on PR title. The PR title should follow [Conventional Commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/). Acceptable "types" are:

* **doc**: purely documentation updates (semver patch)
  * "scope" is usually the loader's name
* **dep**: a dependency update (semver patch or major)
  * "scope" is the dependency's name
* **fix**: correct a bug (semver patch)
  * "scope" is usually the loader's name
* **feat**: add a new feature to an existing loader or introduce a new loader (semver minor or major)
  * "scope" is usually the loader's name
* **setup**: adjust the repository setup, like CI workflows (no semver).
  * "scope" is usually workflow or configuration item's name
* **test**: add, delete, or update a test.
  * "scope" is usually the loader's name

Before a pull request is merged, the following requirements should be met:

- The pull request has a descriptive title and follows the commit message guidelines.
- An approval is valid if there have been no major changes since it was granted.
- 24 hours after approval and no objections, the pull request can be merged.
- All tests pass.

## [Developer's Certificate of Origin 1.1](https://developercertificate.org)

```
By contributing to this project, I certify that:

- (a) The contribution was created in whole or in part by me and I have the right to
  submit it under the open source license indicated in the file; or
- (b) The contribution is based upon previous work that, to the best of my knowledge,
  is covered under an appropriate open source license and I have the right under that
  license to submit that work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am permitted to submit under a
  different license), as indicated in the file; or
- (c) The contribution was provided directly to me by some other person who certified
  (a), (b) or (c) and I have not modified it.
- (d) I understand and agree that this project and the contribution are public and that
  a record of the contribution (including all personal information I submit with it,
  including my sign-off) is maintained indefinitely and may be redistributed consistent
  with this project or the open source license(s) involved.
```
