import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) {
	module.register('./react.mock.js', import.meta.url);
}

export * from './react.mock.js';
