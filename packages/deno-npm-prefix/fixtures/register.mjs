import module from 'node:module';

module.register('../deno-npm-prefix.loader.mjs', import.meta.url);
