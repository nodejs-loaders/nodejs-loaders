import assert from 'node:assert/strict';
import { globSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

test('Loader `package.json`s', { concurrency: true }, async (t) => {
	const descriptionRgx = /Extend node to support .+ via customization hooks./;
	const keywordsList = [
		"customization hooks",
		"loader",
		"node",
		"node.js",
	];
	const maintainersList = [
		"Augustin Mauroy",
		"Jacob Smith",
	];
	const nameRgx = /@nodejs-loaders\/[a-z\n]+/;
	/** @type {Record<string, unknown>[]} */
	const pjsons = await Promise.all(
		globSync(fileURLToPath(`${import.meta.resolve('../packages/')}*/package.json`))
			.map((pjsonPath) => import(pjsonPath, { with: { type: 'json' } }).then((m) => m.default))
	);
	const repoUrl = 'git+https://github.com/nodejs-loaders/nodejs-loaders.git';

	for (const pjson of pjsons) {
		await t.test(`validate 'package.json' of ${pjson.name}`, async () => {
			const {
				author,
				description,
				engines,
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
			assert.equal(license, 'ISC');
			assert.match(main, new RegExp(`\.\/${loaderName}\.mjs`));
			assert.partialDeepStrictEqual(maintainers, maintainersList);
			assert.equal(repository.type, 'git');
			assert.equal(repository.url, repoUrl);
			assert.match(repository.directory, new RegExp(`packages/${loaderName}`));
			assert.equal(type, 'module');
			assert.match(types, new RegExp(`\.\/${loaderName}\.d\.mts`));

			if (!pjson.isNotLoader) {
				assert.match(description, descriptionRgx);
				assert.partialDeepStrictEqual(keywords, keywordsList);
			}
		});
	}
});
