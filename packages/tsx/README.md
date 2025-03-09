# Nodejs Loaders: JSX / TSX

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/tsx.svg)](https://www.npmjs.com/package/@nodejs-loaders/tsx)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/tsx)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/tsx.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/tsx
```

```console
$ node --import @nodejs-loaders/tsx main.js
```

See `README.md` in the repository's root for more details.

**Environment**: test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)

> [!TIP]
> If you are using _only_ TypeScript (**not** tsx), consider using Node.js's builtin [type stripping](https://nodejs.org/api/typescript.html#type-stripping). This _can_ handle it, but the builtin may provide better/more consisent results.

This loader facilitates running tests against JSX or TSX components. It looks for a `esbuild.config.mjs` in the project root (the current working directory); if your config lives in a different location, create a symlink to it from your project root. Only options for [esbuild's "transform" API](https://esbuild.github.io/api/#transform) are valid (esbuild handles looking for a tsconfig). When none is found, it uses a few necessary default.

This loader does _not_ handle TypeScript's file extension nonsense. Import specifiers must use the actual file extension of the file actually on disk:

```
./
  ├ …
  └ foo.ts
```

💥 `import foo from './foo.js';`<br />
✅ `import foo from './foo.ts';`

If your project contains erroneous specifiers like above, use the [correct-ts-specifiers](https://github.com/JakobJingleheimer/correct-ts-specifiers) codemod to fix your source-code.

<details>
<summary>Supported file extensions</summary>

* `.jsx`
* `.mts`
* `.ts`
* `.tsx`
</details>

## Alternatives

* [Node's built-in support](https://nodejs.org/api/typescript.html) (via [amaro](https://github.com/nodejs/amaro)). `@nodejs-loader/tsx` currently supports more than Amaro.
* [SWC register](https://github.com/swc-project/swc-node/tree/master/packages/register#swc-noderegister)
* [ts-node](https://typestrong.org/ts-node/docs/), it's bigger because they support old node versions. It's also based on typescript.
* [tsx](https://github.com/privatenumber/tsx), it's bigger because they inlude more features such as a cli. It's also based on esbuild.
