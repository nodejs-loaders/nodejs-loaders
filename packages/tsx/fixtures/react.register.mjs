import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./react.mock.mjs', import.meta.url);
}

export * from './react.mock.mjs';
