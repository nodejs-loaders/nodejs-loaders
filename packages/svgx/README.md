# Nodejs Loaders: SVGX

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/svgx.svg)](https://www.npmjs.com/package/@nodejs-loaders/svgx)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/svgx)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/svgx.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/svgx
```

```console
$ node --import @nodejs-loaders/svgx main.js
```

See `README.md` in the repository's root for more details.

**Environment**: test

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader facilitates running tests against JSX/TSX components that consume SVGs as JSX/TSX. It looks for a `esbuild.config.mjs` in the project root (the current working directory); if your config lives in a different location, create a symlink to it from your project root. Only options for [esbuild's "transform" API](https://esbuild.github.io/api/#transform) are valid (esbuild handles looking for a tsconfig). When none is found, it uses a few necessary default.

If your project contains legacy specifiers (eg without a file extension), use the [`correct-ts-specifiers``](https://github.com/nodejs/userland-migrations/tree/main/recipes/correct-ts-specifiers) codemod to fix your source-code.

This loader depends on `@nodejs-loaders/text` and `@nodejs-loaders/tsx`, which must be registered _after_ it, like:

```js
module.register(`@nodejs-loaders/svgx`);
module.register(`@nodejs-loaders/text`);
module.register(`@nodejs-loaders/tsx`);
```

<details>
<summary>Supported file extensions</summary>

* `.svg`
</details>
