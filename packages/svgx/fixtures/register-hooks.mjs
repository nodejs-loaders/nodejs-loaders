import module from 'node:module';

import * as svgxLoader from '../svgx.loader.mjs';

module.registerHooks(svgxLoader);
