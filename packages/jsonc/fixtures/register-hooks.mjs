import module from 'node:module';

import * as jsoncHooks from '../jsonc.loader.mjs';

module.registerHooks(jsoncHooks);
