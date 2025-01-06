# Nodejs Loaders

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

![coverage](https://img.shields.io/coverallsCoverage/github/nodejs-loaders/nodejs-loaders)
![tests](https://github.com/nodejs-loaders/nodejs-loaders/actions/workflows/ci.yml/badge.svg)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/nodejs-loaders/nodejs-loaders/badge)](https://scorecard.dev/viewer/?uri=github.com/nodejs-loaders/nodejs-loaders)

This package provides a variety of loaders to facilitate quick and easy local development and CI testing.

> [!WARNING]
> These should NOT be used in production; they will likely not do what you need there anyway.

## Usage

The following JustWorks¹:

```console
$ node --import ./register.mts ./main.tsx
```

```ts
import { register } from 'node:module';

register('@nodejs-loaders/tsx', import.meta.url);
register('@nodejs-loaders/css-module', import.meta.url);
register('@nodejs-loaders/media', import.meta.url);
```

```tsx
import { ProfileAvatar } from './ProfileAvatar.tsx';
import * as classes from './ProfileAvatar.module.css';
import defaultProfileAvatar from './default.png';

console.log(
  <ProfileAvatar
    className={classes.AdminUser}
    src={defaultProfileAvatar}
  />
);
```

¹ Prior to node 23.6.0, a flag is needed to support TypeScript in `register.mts` (otherwise, it can be `register.mjs` instead).

## Available loaders

* [Alias](./packages/alias/)
* [CSS Modules](./packages/css-module/)
* [deno 'npm:' prefix](./packages/deno-npm-prefix/)
* [JSONC](./packages/jsonc/)
* [JSX / TSX](./packages/tsx/)
* [Media](./packages/media/)
* [Mismatched format](./packages/mismatched-format/)
* [SVGX](./packages/svgx/)
* [Text](./packages/text/)
* [YAML](./packages/yaml/)

Some loaders must be registered in a specific sequence:

1. alias
2. tsx
3. svgx
4. mismatched-format

These don't need a specific registration sequence:

* css-module
* deno-npm-prefix
* media
* text
* yaml

## Project-official loaders

These loaders are officially maintained by their respective projects and are recommended (they're the most up-to-date and have the best support).

* [Aurelia loader](https://github.com/aurelia/loader-nodejs)
* [MDX loader](https://mdxjs.com/packages/node-loader/)
* [SWC register](https://github.com/swc-project/swc-node/tree/master/packages/register#swc-noderegister)
