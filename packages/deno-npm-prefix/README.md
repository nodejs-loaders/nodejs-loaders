# `npm:` prefix loader for Node.js

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/deno-npm-prefix.svg)](https://www.npmjs.com/package/@nodejs-loaders/deno-npm-prefix)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/deno-npm-prefix)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/deno-npm-prefix.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/deno-npm-prefix
```

```console
$ node --import @nodejs-loaders/deno-npm-prefix main.js
```

See `README.md` in the repository's root for more details.

**Environments**: dev, test

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader enables loading modules using the `npm:` prefix in Node.js. This syntax is used most notably by Deno to [import npm packages](https://docs.deno.com/runtime/fundamentals/node/#using-npm-packages).

There is discussion within Node.js to introduce native support for this feature: [nodejs/node#44492](https://github.com/nodejs/node/issues/44492)

After installing the loader and registering it with Node.js, you can use the `npm:` prefix to import modules from npm. For example:

```js
import express from 'npm:express';
```

> [!NOTE]
> The resolution still happens in the `node_modules` directory, so you must have the package installed.
