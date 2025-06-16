/* @ts-self-types="./json5.d.mts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./json5.loader.mjs', import.meta.url);
}

export * from './json5.loader.mjs';
