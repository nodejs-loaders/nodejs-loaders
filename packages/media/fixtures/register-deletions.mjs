import module from 'node:module';

module.register('../media.loader.mjs', import.meta.url, { data: { deletions: ['.mp3'] } });
