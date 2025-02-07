import assert from 'node:assert/strict';
import { globSync } from 'node:fs';
import { test, it } from 'node:test';
import { fileURLToPath } from 'node:url';

/**
 * @todo(@AugustinMauroy): refracto to include JSR.json testing
 */

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
	const jsrjson = await Promise.all(
		globSync(
			fileURLToPath(`${import.meta.resolve('../packages/')}*/jsr.json`),
		).map((jsrjsonPath) =>
			import(jsrjsonPath, { with: { type: 'json' } }).then((m) => m.default),
		),
	);
	const repoUrl = 'git+https://github.com/nodejs-loaders/nodejs-loaders.git';

	it('should have same amount of packages', () => {
		assert.equal(jsrjson.length, pjsons.length);
	});

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
			assert.match(main, new RegExp(`\.\/${loaderName}\.js`));
			assert.partialDeepStrictEqual(maintainers, maintainersList);
			assert.equal(repository.type, 'git');
			assert.equal(repository.url, repoUrl);
			assert.match(repository.directory, new RegExp(`packages/${loaderName}`));
			assert.equal(type, 'module');
			assert.match(types, new RegExp(`\.\/${loaderName}\.d\.ts`));

			if (!pjson.isNotLoader) {
				assert.match(description, descriptionRgx);
				assert.partialDeepStrictEqual(keywords, keywordsList);
			}
		});

		for (const jsr of jsrjson) {
			await t.test(`validate 'jsr.json' of ${jsr.name}`, async () => {
				const { name, version } = jsr;

				assert.match(name, nameRgx);
				assert.ok(version);
			});
		}

		for (let i = 0; i < jsrjson.length; i++) {
			t.test(
				`validate jsr:${jsrjson[i].name} and npm:${pjsons[i].name}`,
				() => {
					assert.equal(jsrjson[i].name, pjsons[i].name);
					assert.equal(jsrjson[i].version, pjsons[i].version);
				},
			);
		}
	}
});
