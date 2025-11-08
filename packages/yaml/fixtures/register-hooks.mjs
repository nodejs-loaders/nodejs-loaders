import module from 'node:module';

import * as yamlLoader from '../yaml.loader.mjs';

module.registerHooks(yamlLoader);
