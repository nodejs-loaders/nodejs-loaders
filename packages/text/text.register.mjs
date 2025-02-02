import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) module.register('./text.loader.mjs', import.meta.url);

export * from './text.loader.mjs';
