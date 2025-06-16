/* @ts-self-types="./tsx.d.mts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./tsx.loader.mjs', import.meta.url);
}

export * from './tsx.loader.mjs';
