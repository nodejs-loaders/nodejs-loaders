import assert from 'node:assert/strict';
import { globSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

test('Loader `package.json`s', { concurrency: true }, async (t) => {
	const descriptionRgx = /Extend node to support .+ via customization hooks./;
	const keywordsList = ['customization hooks', 'loader', 'node', 'node.js'];
	const maintainersList = ['Augustin Mauroy', 'Jacob Smith'];
	const nameRgx = /@nodejs-loaders\/[a-z\n]+/;
	/** @type {Record<string, unknown>[]} */
	const pjsons = await Promise.all(
		globSync(
			fileURLToPath(`${import.meta.resolve('../packages/')}*/package.json`),
		).map((pjsonPath) =>
			import(pjsonPath, { with: { type: 'json' } }).then((m) => m.default),
		),
	);
	const repoUrl = 'git+https://github.com/nodejs-loaders/nodejs-loaders.git';

	const tests = [];
	for (const [i, pjson] of pjsons.entries()) {
		tests[i] = t.test(`validate 'package.json' of ${pjson.name}`, async () => {
			const {
				author,
				description,
				engines,
				exports,
				keywords,
				license,
				main,
				maintainers,
				name,
				repository,
				type,
				types,
			} = pjson;

			assert.match(name, nameRgx);
			const loaderName = name.slice(16);
			assert.ok(author);
			assert.ok(engines.node);
			// Loader packages should use "main"
			if (!(pjson.isNotLoader)) assert.ok(!('exports' in pjson));
			assert.equal(license, 'ISC');
			if ('main' in pjson || !pjson.isNotLoader) {
				assert.equal(main, `./${loaderName}.mjs`);
				assert.equal(types, `./${loaderName}.d.mts`);
			} else {
				const subpaths = Object.keys(exports);

				// The pjson export is different from all the others, so check it first, and then remove it.
				const pjsonIdx = subpaths.indexOf('./package.json');
				assert.equal(subpaths[pjsonIdx], './package.json');
				subpaths.splice(pjsonIdx, 1);

				// oxlint-disable sort-keys
				for (const subpath of subpaths) {
					const exp = exports[subpath];
					const name = subpath.slice(2); // Skip './'
					try {
						assert.deepEqual(exp, {
							types: `./${name}.d.mts`,
							default: `./${name}.mjs`,
						});
					} catch (err1) {
						try {
							assert.deepEqual(exp, {
								types: `./${name}/${name}.d.mts`,
								default: `./${name}/${name}.mjs`,
							});
						} catch (err2) {
							throw new AggregateError(
								[err1, err2],
								// oxlint-disable-next-line no-template-curly-in-string
								'A subpath export’s specifier should follow either "./${subpath_name}.${ext}" or "./${subpath_name}/${subpath_name}.${ext}"', { cause: err1 }, { cause: err2 }
							);
						}
					}
				}
				// oxlint-enable sort-keys
			}
			assert.partialDeepStrictEqual(maintainers, maintainersList);
			assert.equal(repository.type, 'git');
			assert.equal(repository.url, repoUrl);
			assert.match(repository.directory, new RegExp(`packages/${loaderName}`));
			assert.equal(type, 'module');

			if (!pjson.isNotLoader) {
				assert.match(description, descriptionRgx);
				assert.partialDeepStrictEqual(keywords, keywordsList);
			}
		});
	}

	await Promise.all(tests);
});
