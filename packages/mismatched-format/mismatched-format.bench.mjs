import { Suite, chartReport } from 'bench-node';
import { load } from './mismatched-format.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';

const suite = new Suite({
	reporter: chartReport,
});

const cjsRequire = import.meta.resolve(
	'./fixtures/actually-cjs/uses-require.cjs.js',
);
const cjsModuleExports = import.meta.resolve(
	'./fixtures/actually-cjs/module-exports.cjs.js',
);
const esmCreateRequire = import.meta.resolve(
	'./fixtures/actually-esm/create-require.esm.js',
);
const esmRequireInComment = import.meta.resolve(
	'./fixtures/actually-esm/require-in-comment.esm.js',
);

suite.add('CJS: require()', { repeatSuite: 2 }, async () => {
	await load(cjsRequire, {}, nextLoad);
});

suite.add('CJS: module.exports', { repeatSuite: 2 }, async () => {
	await load(cjsModuleExports, {}, nextLoad);
});

suite.add('ESM: createRequire', { repeatSuite: 2 }, async () => {
	await load(esmCreateRequire, {}, nextLoad);
});

suite.add('ESM: require() within a comment', { repeatSuite: 2 }, async () => {
	await load(esmRequireInComment, {}, nextLoad);
});

suite.run();
