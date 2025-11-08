# Nodejs Loaders: Text

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/text.svg)](https://www.npmjs.com/package/@nodejs-loaders/text)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/text)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/text.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/text
```

```console
$ node --import @nodejs-loaders/text main.js
```

See `README.md` in the repository's root for more details.

**Environment**: test

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader handles files that are effectively plain text.

<details>
<summary>Supported file extensions</summary>

* `.graphql`
* `.gql`
* `.md`
* `.txt`
</details>

## Alternatives

* [`esm-loader-css`](https://www.npmjs.com/package/esm-loader-css) - This alternative **only** supports CSS files.
