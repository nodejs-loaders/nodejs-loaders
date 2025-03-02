# Nodejs Loaders: Mismatched format

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/mismatched-format.svg)](https://www.npmjs.com/package/@nodejs-loaders/mismatched-format)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/mismatched-format)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)

> [!important]
> This loader works in most but not necessarily all cases. If you encounter a case where it fails to appropriately correct a mismatch, please open an issue and include the inappropriately handled module, what it claimed to be, and what the loader resolved the format to.

Many packages are incorrectly configured, claiming to be ESM yet don't actually surface ESM. This is most commonly due to a `package.json` using the non-standard `"module"` field:

```json
{
  "name": "mismatched-example",
  "type": "module",
  "main": "./dist/cjs.js",
  "module":  "./dist/esm.js"
}
```

`mismatched-example` has told node its main entry point is `./dist/cjs.js` and that it is ESM. Therefore, trying to import this package will (likely) explode in a `SyntaxError` as node loads `./dist/cjs.js` as ESM (instead of the CJS it actually is).

This loader detects the explosion and re-instructs node to ignore the misconfiguration and instead load `./dist/cjs.js` as CJS (the loader doesn't try to find a potential ESM main entry point the package may have—there are too many options, several of which are non-standard).

Note to package authors reading this: The simplest fix here is to distribute only CJS. See [_Configuring CommonJS & ES Modules for Node.js_](https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed) for a thorough explanation of options.

> [!IMPORTANT]
> This is _not_ the same as [`--experimental-detect-module`](https://nodejs.org/api/cli.html#--experimental-detect-module): even with module detection enabled, node still believes when it is explicitly told a specific format (ex by `"type": "module"`), so it will not try to confirm it. Module detection also works only way: try CJS, then try ESM (_never_ try ESM, then try CJS).
