/* @ts-self-types="./media.d.ts" */
import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./media.loader.js', import.meta.url);
}

export * from './media.loader.js';
