import module from 'node:module';

module.register('../alias.js', import.meta.url);
