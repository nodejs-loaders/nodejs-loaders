# Nodejs Loaders: jsonc

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/@nodejs-loaders/jsonc)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/jsonc)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)

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
