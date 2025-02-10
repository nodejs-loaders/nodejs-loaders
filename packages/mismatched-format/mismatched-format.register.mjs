import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./mismatched-format.loader.mjs', import.meta.url);
}

export * from './mismatched-format.loader.mjs';
