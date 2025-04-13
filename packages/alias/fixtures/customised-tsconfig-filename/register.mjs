import module from 'node:module';

module.register('../../alias.loader.mjs', import.meta.url, { data: { location: 'tsconfig.whatever.json' } });
