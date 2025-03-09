# Nodejs Loaders: Media

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/@nodejs-loaders/media)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/media)

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

Media loader accepts additions and deletions to its default list of file extenions via `module.register`:

```console
$ node --import ./register.mts ./main.tsx
```

```js
// ./register.mts

import module from 'node:module';

module.register('@nodejs-loaders/media', import.meta.url, {
	data: {
		additions: ['.ext'],
		deletions: ['.ico'],
	},
});
```

```jsx
// main.tsx

import someFile from './some.ext'; // someFile = '[…]/some.ext'
```

## Alternatives

* [`esm-loader-images`](https://github.com/brev/esm-loaders/tree/main/packages/esm-loader-images#readme) - This alternative loader just supports images.
