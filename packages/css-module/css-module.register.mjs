import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./css-module.loader.mjs', import.meta.url);
}

export * from './css-module.loader.mjs';
