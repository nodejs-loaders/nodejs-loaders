/* @ts-self-types="./svgx.d.mts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./svgx.loader.mjs', import.meta.url);
}

export * from './svgx.loader.mjs';
