import module from 'node:module';

module.register('../alias.loader.mjs', import.meta.url);
