# Nodejs Loaders

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

![coverage](https://img.shields.io/coverallsCoverage/github/nodejs-loaders/nodejs-loaders)
![tests](https://github.com/nodejs-loaders/nodejs-loaders/actions/workflows/ci.yml/badge.svg)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/nodejs-loaders/nodejs-loaders/badge)](https://scorecard.dev/viewer/?uri=github.com/nodejs-loaders/nodejs-loaders)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10004/badge)](https://www.bestpractices.dev/projects/10004)

This package provides a variety of loaders to facilitate quick and easy local development and CI testing.

> [!WARNING]
> These should NOT be used in production; they will likely not do what you need there anyway.

## Usage

The following JustWorks¹:

You can register an individual nodejs-loader via `--import` like:

```console
$ node --import=@nodejs-loaders/tsx ./main.tsx
```

Or register multiple nodejs-loaders via multiple `--import`s like:

```console
$ node \
  --import=@nodejs-loaders/tsx \
  --import=@nodejs-loaders/css-module \
  --import=@nodejs-loaders/media \
  ./main.tsx
```

But that can quickly clutter the CLI. Instead, you may want to create your own `register.ts` like so:

```console
$ node --import ./register.ts ./main.tsx
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

¹ Prior to node 23.6.0, a flag is needed to support TypeScript in `register.ts` (otherwise, it can be `register.js` instead).

### Usage with `module.registerHooks`

Some nodejs-loaders are compatible with the sync version of customization hooks. In order to avoid the loader automatically registering itself via the async API (which it does when imported via its `main` entrypoint), you must import it via the direct path:

```js
import module from 'node:module';

import * as aliasLoader from '@nodejs-loaders/alias/alias.loader.mjs';
 // ⚠️ Do NOT import via `main`, like '@nodejs-loaders/alias'

module.registerHooks(aliasLoader);
```

## Available loaders

* [Alias](./packages/alias/)
* [CSS Modules](./packages/css-module/)
* [deno 'npm:' prefix](./packages/deno-npm-prefix/)
* [JSON5](./packages/json5/)
* [JSONC](./packages/jsonc/)
* [JSX / TSX](./packages/tsx/)
* [Media](./packages/media/)
* [Mismatched format](./packages/mismatched-format/)
* [SVGX](./packages/svgx/)
* [Text](./packages/text/)
* [YAML](./packages/yaml/)

Some loaders must be registered in a specific sequence:

1. alias
1. tsx
1. svgx
1. mismatched-format

These don't need a specific registration sequence:

* css-module
* deno-npm-prefix
* JSON5
* JSONC
* media
* text
* YAML

## Project-official loaders

These loaders are officially maintained by their respective projects and are recommended (they're the most up-to-date and have the best support).

* [Aurelia loader](https://github.com/aurelia/loader-nodejs)
* [MDX loader](https://mdxjs.com/packages/node-loader/)
* [SWC register](https://github.com/swc-project/swc-node/tree/master/packages/register#swc-noderegister)
