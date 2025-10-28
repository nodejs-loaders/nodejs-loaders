import module from 'node:module';

import * as cssModuleLoader from '../css-module.loader.mjs';

module.registerHooks(cssModuleLoader);
