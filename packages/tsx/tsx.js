/* @ts-self-types="./tsx.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./tsx.loader.js', import.meta.url);
}

export * from './tsx.loader.js';
