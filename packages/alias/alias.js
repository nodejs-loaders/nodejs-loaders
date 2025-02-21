/* @ts-self-types="./alias.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./alias.loader.js', import.meta.url);
}

export * from './alias.loader.js';
