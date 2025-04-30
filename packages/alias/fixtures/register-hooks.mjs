import module from 'node:module';

import * as aliasLoader from '../alias.mjs';

module.registerHooks(aliasLoader);
