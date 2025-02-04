import module from 'node:module';

import * as npmPrefix from '../deno-npm-prefix.js';

module.registerHooks(npmPrefix);
