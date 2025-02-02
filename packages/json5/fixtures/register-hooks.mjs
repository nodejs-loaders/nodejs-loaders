import module from 'node:module';

import * as json5Loader from '../json5.mjs';

module.registerHooks(json5Loader);
