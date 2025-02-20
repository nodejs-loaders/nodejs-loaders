import module from 'node:module';

import * as aliasLoader from '../alias.loader.js';

module.registerHooks(aliasLoader);
