import module from 'node:module';

import * as jsoncLoader from '../jsonc.loader.mjs';

module.registerHooks(jsoncLoader);
