import module from 'node:module';

import * as json5Hooks from '../json5.loader.mjs';

module.registerHooks(json5Hooks);
