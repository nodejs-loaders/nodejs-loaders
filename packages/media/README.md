# Nodejs Loaders: Media

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/@nodejs-loaders/media)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/media)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/media.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/media
```

```console
$ node --import @nodejs-loaders/media main.js
```

See `README.md` in the repository's root for more details.

**Environment**: test

This loader returns the specifier (truncated from project root / current working directory) as the default export:

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)

```js
import photo from './team.jpg'; // photo = '[…]/team.jpg'
```

This ensures snapshots are unaffected by the file system on which the test is run.

<details>
<summary>Supported file extensions</summary>

Audio/Video:
* `.av1`
* `.mp3`
* `.mp3`
* `.mp4`
* `.ogg`
* `.webm`

Images:

* `.avif`
* `.gif`
* `.ico`
* `.jpeg`
* `.jpg`
* `.png`
* `.webp`
</details>

## Extending supported extensions

Media loader's default list of file extenions can be modified via `module.register`; either with addition(s) and/or deletion(s) OR replacements:

```console
$ node ./example.mts
```

```js
// ./example.mts

import module from 'node:module';

module.register('@nodejs-loaders/media', import.meta.url, {
	data: {
		additions: ['.ext'], // This will add .ext to the default list.
		deletions: ['.ico'], // This will remove .ico from the default list.
	},
});

const someFileA = await import('./some.ext'); // someFile = '[…]/some.ext'
const someFileB = await import('./some.ico'); // 💥
```

OR

```js
// ./example.mts

import module from 'node:module';

module.register('@nodejs-loaders/media', import.meta.url, {
	data: ['.ext'], // ⚠️ This will REPLACE the entire list with ONLY the .ext file extension.
});

const someFileA = await import('./some.ext'); // someFile = '[…]/some.ext'
const someFileB = await import('./some.ico'); // 💥
```

## Alternatives

* [`esm-loader-images`](https://github.com/brev/esm-loaders/tree/main/packages/esm-loader-images#readme) - This alternative loader just supports images.
