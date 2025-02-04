import module from 'node:module';

import * as aliasLoader from '../alias.js';

module.registerHooks(aliasLoader);
