/* @ts-self-types="./svgx.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./svgx.loader.js', import.meta.url);
}

export * from './svgx.loader.js';
