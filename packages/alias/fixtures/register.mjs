import module from 'node:module';

module.register('../alias.mjs', import.meta.url);
