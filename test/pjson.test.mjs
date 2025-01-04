import assert from 'node:assert/strict';
import { globSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

test('Loader `package.json`s', { concurrency: true }, async (t) => {
	const descriptionRgx = /Extend node to support [\w]+ via customisation hooks./;
	const keywordsList = [
		"customisation hook",
		"loader",
		"node",
		"node.js",
	];
	const maintainersList = [
		"Augustin Mauroy",
		"Jacob Smith",
	];
	const nameRgx = /@nodejs-loaders\/[a-z\n]+/;
	const pjsonPaths = globSync(fileURLToPath(`${import.meta.resolve('../packages/')}**/package.json`));
	const repoUrl = 'https://github.com/nodejs-loaders/nodejs-loaders';

	for (const pjsonPath of pjsonPaths) {
		await t.test('should contain required fields', async () => {
			const {
				author,
				description,
				engines,
				keywords,
				main,
				maintainers,
				name,
				repository,
				type,
				types,
			} = (await import(pjsonPath, { with: { type: 'json' } })).default;

			assert.match(name, nameRgx);
			const strippedName = name.slice(16);
			console.log({ strippedName })
			assert.ok(author);
			assert.match(description, descriptionRgx);
			assert.ok(engines.node);
			assert.deepEqual(keywords, keywordsList);
			assert.equal(license, 'ISC');
			assert.match(main, new RegExp(`/\.\/${strippedName}\.mjs/`));
			assert.deepEqual(maintainers, maintainersList);
			assert.equal(repository.type, 'git');
			assert.equal(repository.url, repoUrl);
			assert.match(repository.directory, new RegExp('/packages/${strippedName}/'));
			assert.equal(type, 'module');
			assert.match(types, new RegExp(`/\.\/${strippedName}\.d\.mts/`));
		});
	}
});
