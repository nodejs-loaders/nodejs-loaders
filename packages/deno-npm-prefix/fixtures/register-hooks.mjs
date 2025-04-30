import module from 'node:module';

import * as npmPrefix from '../deno-npm-prefix.mjs';

module.registerHooks(npmPrefix);
