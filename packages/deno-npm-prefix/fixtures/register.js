import module from 'node:module';

module.register('../deno-npm-prefix.loader.js', import.meta.url);
