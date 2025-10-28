# Nodejs Loaders: jsonc

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/@nodejs-loaders/jsonc)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/jsonc)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/jsonc.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/jsonc
```

```console
$ node --import @nodejs-loaders/jsonc main.js
```

See `README.md` in the repository's root for more details.

**Environments**: dev, test

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

To import a JSONC file in node, it must have a `.jsonc` file extension **and** an [import attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) in the import statement (for consistency with Node.js's support for `json` imports):

```js
import data from './data.jsonc' with { type: 'jsonc' };

// OR

const data = await import('./data.jsonc', { with { type: 'jsonc' } });
```

```jsonc
{
  // JSONC file
  "key": "value"
  /* comment */
}
```

<details>
<summary>Supported file extensions</summary>

* `.jsonc`
</details>
