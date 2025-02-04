import module from 'node:module';

module.register('../deno-npm-prefix.js', import.meta.url);
