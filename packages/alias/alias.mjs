/* @ts-self-types="./alias.d.mts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./alias.loader.mjs', import.meta.url);
}

export * from './alias.loader.mjs';
