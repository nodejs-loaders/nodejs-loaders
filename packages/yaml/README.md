# Nodejs Loaders: YAML

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/yaml.svg)](https://www.npmjs.com/package/@nodejs-loaders/yaml)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/yaml)
[![compatible node version(s)](https://img.shields.io/node/v/@nodejs-loaders/yaml.svg)](https://nodejs.org/download)

## Usage

```console
$ npm i -D @nodejs-loaders/yaml
```

```console
$ node --import @nodejs-loaders/yaml main.js
```

See `README.md` in the repository's root for more details.

**Environment**: test, development

**Compatible APIs**:

* [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)
* [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader enables importing [YAML](https://yaml.org) files, converting them to a plain javascript object. YAML is commonly used for configuration files, which are often more easily represented in YAML than JSON.

```yaml
# config.yaml
foo: bar
baz:
  - qux
  - zed
```

```js
import config from './config.yaml';

config.foo; // 'bar'
config.baz; // ['qux', 'zed']
```

<details>
<summary>Supported file extensions</summary>

* `.yaml`
* `.yml`
</details>

**Alternatives**

* [`esm-loader-yaml`](https://www.npmjs.com/package/esm-loader-yaml)
