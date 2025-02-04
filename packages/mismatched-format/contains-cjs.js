/**
 *
 * @param {import('node:module').ModuleSource} source
 * @returns
 */
export function containsCJS(source) {
	const src = '' + source;

	if (EXPORTS_PROPERTY.test(src)) return true;

	if (OBJECT_DEFINE_EXPORT.test(src)) return true;

	if (!CREATE_REQUIRE.test(src) && REQUIRE.test(src)) return true;

	return false;
}

/**
 * `exports.foo =` and friends
 */
const EXPORTS_PROPERTY =
	/(?<!(\/\/.*|\*.*))exports(:?\.\w+|\[(:?'|")?.*(:?'|")?\])? *=(?!=)/;

/**
 * `Object.defineProperty(exports,` and friends
 */
const OBJECT_DEFINE_EXPORT = /(?<!(\/\/.*|\*.*))\(exports *,/;

const CREATE_REQUIRE = /createRequire\(/;

/**
 * `require('foo')` and friends
 */
const REQUIRE = /(?<!(\.|\/\/.*|\*.*))require\(/;
