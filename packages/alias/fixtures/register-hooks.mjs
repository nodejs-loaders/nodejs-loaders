import module from 'node:module';

import * as aliasLoader from '../alias.loader.mjs';

module.registerHooks(aliasLoader);
