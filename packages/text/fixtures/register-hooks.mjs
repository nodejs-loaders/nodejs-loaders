import module from 'node:module';

import * as textLoader from '../text.loader.mjs';

module.registerHooks(textLoader);
