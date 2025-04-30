import module from 'node:module';

module.register('../deno-npm-prefix.mjs', import.meta.url);
