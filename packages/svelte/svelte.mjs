/* @ts-self-types="./svelte.d.mts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./svelte.loader.mjs', import.meta.url);
}

export * from './svelte.loader.mjs';
