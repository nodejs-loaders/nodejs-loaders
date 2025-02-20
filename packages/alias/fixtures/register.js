import module from 'node:module';

module.register('../alias.loader.js', import.meta.url);
