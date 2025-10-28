
# Nodejs Loaders: json5

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/json5.svg)](https://www.npmjs.com/package/@nodejs-loaders/json5)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/json5)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/json5.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/json5
```

```console
$ node --import @nodejs-loaders/json5 main.js
```

See `README.md` in the repository's root for more details.

**Environments**: dev, test

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

To import a JSON5 file in Node.js, it must have a `.json5` file extension **and** an [import attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) in the import statement (for consistency with Node.js's support for `json` imports):

```js
import data from './data.json5' with { type: 'json5' };

// OR

const data = await import('./data.json5', { with: { type: 'json5' } });
```

```json5
{
  // JSON5 file example
  key: "value",
  number: 42,
  // Comment line
}
```

<details>
<summary>Supported file extensions</summary>

* `.json5`
</details>
