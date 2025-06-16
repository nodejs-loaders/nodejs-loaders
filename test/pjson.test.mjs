import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { describe, it } from 'node:test';

const descriptionRgx = /Extend node to support .+ via customization hooks./;
const keywordsList = ['customization hooks', 'loader', 'node', 'node.js'];
const maintainersList = ['Augustin Mauroy', 'Jacob Smith'];
const nameRgx = /@nodejs-loaders\/[a-z\n]+/;
const repoUrl = 'git+https://github.com/nodejs-loaders/nodejs-loaders.git';
const jsr_publish_expected_keys = {
	include: ['./*.mjs', './*.d.mts', './*.d.mts.map'],
	exclude: [
		'!./*.mjs',
		'!./*.d.mts',
		'!./*.d.mts.map',
		'./*.bench.mjs',
		'./*.test.mjs',
		'./*.spec.mjs',
		'./fixtures/**/*',
	],
};
const jsr_json_schema = 'https://jsr.io/schema/config-file.v1.json';

const workspacesOutput = execSync('npm query .workspace').toString();
const workspaces = JSON.parse(workspacesOutput).map((w) => w.path);

describe('Loader `package.json`s', () => {
	for (const workspace of workspaces) {
		const pjson = JSON.parse(readFileSync(`${workspace}/package.json`, 'utf8'));
		const jsr = JSON.parse(readFileSync(`${workspace}/jsr.json`, 'utf8'));

		it(`validate 'package.json' of ${pjson.name}`, () => {
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
			const loaderName = name.slice(16);

			assert.match(name, nameRgx);
			assert.ok(author);
			assert.ok(engines.node);
			assert.equal(license, 'ISC');
			assert.match(main, new RegExp(`./${loaderName}.mjs`));
			assert.partialDeepStrictEqual(maintainers, maintainersList);
			assert.equal(repository.type, 'git');
			assert.equal(repository.url, repoUrl);
			assert.match(repository.directory, new RegExp(`packages/${loaderName}`));
			assert.equal(type, 'module');
			assert.match(types, new RegExp(`./${loaderName}.d.mts`));

			if (!pjson.isNotLoader) {
				assert.match(description, descriptionRgx);
				assert.partialDeepStrictEqual(keywords, keywordsList);
			}
		});

		it(`validate 'jsr.json' of ${jsr.name}`, () => {
			const { name, version } = jsr;

			assert.match(name, nameRgx);
			assert.ok(version);
			assert.partialDeepStrictEqual(jsr.publish, jsr_publish_expected_keys);
			assert.equal(jsr.$schema, jsr_json_schema);
		});

		it(`validate jsr:${jsr.name} and npm:${pjson.name}`, () => {
			assert.equal(jsr.name, pjson.name, `jsr:${jsr.name} and npm:${pjson.name} should match`);
			assert.equal(jsr.version, pjson.version, `${jsr.name} version should match npm version`);
			assert.equal(jsr.description, pjson.description, `${jsr.name} description should match npm description`);
			assert.equal(jsr.exports, pjson.main, `${jsr.name} exports should match npm main`);
		});
	}
});
