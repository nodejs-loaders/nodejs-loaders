import module from 'node:module';

import * as npmPrefix from '../deno-npm-prefix.loader.mjs';

module.registerHooks(npmPrefix);
