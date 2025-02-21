import module from 'node:module';

import * as jsoncLoader from '../jsonc.loader.js';

module.registerHooks(jsoncLoader);
