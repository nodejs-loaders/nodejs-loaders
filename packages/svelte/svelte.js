import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./svelte.loader.js', import.meta.url);
}

export * from './svelte.loader.js';
