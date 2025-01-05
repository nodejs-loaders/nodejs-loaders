# Nodejs Loaders

<img src="https://raw.githubusercontent.com/JakobJingleheimer/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

![coverage](https://img.shields.io/coverallsCoverage/github/JakobJingleheimer/nodejs-loaders)
![tests](https://github.com/JakobJingleheimer/nodejs-loaders/actions/workflows/ci.yml/badge.svg)

This package provides a variety of loaders to facilitate a quick and easy CI testing environment.

> [!WARNING]
> These should NOT be used in production; they will likely not do what you need there anyway.

```console
node
# sequence here IS important:
  --loader=@nodejs-loaders/alias \
  --loader=@nodejs-loaders/tsx \
  --loader=@nodejs-loaders/svgx \
  --loader=@nodejs-loaders/mismatched-format \
# sequence here is NOT important:
  --loader=@nodejs-loaders/css-module \
  --loader=@nodejs-loaders/deno-npm-prefix \
  --loader=@nodejs-loaders/media \
  --loader=@nodejs-loaders/text \
  --loader=@nodejs-loaders/yaml \
  ./main.js
```

* [Alias loader](./packages/alias/)
* [CSS Modules loader](./packages/css-module/)
* [deno `npm:` prefix](./packages/deno-npm-prefix/)
* [JSONC loader](./packages/jsonc/)
* [JSX / TSX loader](./packages/tsx/)
* [Media loader](./packages/media/)
* [Mismatched format loader](./packages/mismatched-format/)
* [SVGX loader](./packages/svgx/)
* [Text loader](./packages/text/)
* [YAML loader](./packages/yaml/)

## Project-official loaders

These loaders are officially maintained by their respective projects and are recommended (they're the most up-to-date and have the best support).

* [Aurelia loader](https://github.com/aurelia/loader-nodejs)
* [MDX loader](https://mdxjs.com/packages/node-loader/)
* [SWC register](https://github.com/swc-project/swc-node/tree/master/packages/register#swc-noderegister)
