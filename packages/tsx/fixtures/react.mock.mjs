const REACT_URL = 'file:///tmp/noexist/react/jsx-dev-runtime';
const shortCircuit = true;

async function resolveReact(specifier, ctx, next) {
	if (specifier !== 'react/jsx-dev-runtime') return next(specifier);

	return {
		shortCircuit,
		url: REACT_URL,
	};
}
export { resolveReact as resolve };

async function loadReact(url, ctx, next) {
	if (url !== REACT_URL) return next(url);

	return {
		format: 'module',
		shortCircuit,
		source: 'export function jsxDEV() {}',
	};
}
export { loadReact as load };
