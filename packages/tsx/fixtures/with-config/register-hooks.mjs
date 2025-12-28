import module from 'node:module';

import * as tsxLoader from '../../tsx.loader.mjs';

module.registerHooks(tsxLoader);
