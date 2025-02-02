import { isMainThread } from 'node:worker_threads';
import module from 'node:module';

if (isMainThread && 'register' in module) module.register('./deno-npm-prefix.loader.mjs', import.meta.url);

export * from './deno-npm-prefix.loader.mjs';
