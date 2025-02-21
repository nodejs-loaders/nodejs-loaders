/* @ts-self-types="./json5.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./json5.loader.js', import.meta.url);
}

export * from './json5.loader.js';
