import { Suite, chartReport } from 'bench-node';
import {
	getFilenameExt,
	stripExtras,
	getFilenameParts,
} from './your-module.js';

const suite = new Suite({
	reporter: chartReport,
});

const testUrls = [
	'/path/to/file.js',
	'/path/to/file.js?query=param',
	'/path/to/file.js#anchor',
	'/path/to/file.js?query=param#anchor',
	'https://example.com/path/to/file.js',
	'https://example.com/path/to/file.js?query=param',
	'https://example.com/path/to/file.js#anchor',
	'https://example.com/path/to/file.js?query=param#anchor',
];

suite.add('getFilenameExt', { repeatSuite: 2 }, () => {
	for (const url of testUrls) {
		getFilenameExt(url);
	}
});

suite.add('stripExtras', { repeatSuite: 2 }, () => {
	for (const url of testUrls) {
		stripExtras(url);
	}
});

suite.add('getFilenameParts', { repeatSuite: 2 }, () => {
	for (const url of testUrls) {
		getFilenameParts(url);
	}
});

suite.run();
