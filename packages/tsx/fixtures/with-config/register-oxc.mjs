import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('@nodejs-loaders/tsx/tsx-oxc.mjs', pathToFileURL('./'));
