/* @ts-self-types="./deno-npm-prefix.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./deno-npm-prefix.loader.js', import.meta.url);
}

export * from './deno-npm-prefix.loader.js';
