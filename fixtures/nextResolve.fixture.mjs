export const nextResolveSync = (s) => ({
	format: 'unknown',
	url: s,
});

/**
 * @param  {Parameters<nextResolveSync>} args
 */
export const nextResolveAsync = async (...args) => nextResolveSync(...args);
