# Nodejs Loaders: CSS Module

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/@nodejs-loaders/css-module)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/css-module)

**Environment**: test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)

This loads the module as a plain-object of simple key-value pairs of the css specifiers like:

```css
/* main.module.css */
#Bar {
  font-weight: bold;
}

.Foo {
  text-decoration: none

  .Baz { color: red }
}

.Qux .Zed {
  font-size: 1.1em;
}
```

```js
import styles from 'main.module.css';

styles.Bar; // 'Bar'
styles.Baz; // 'Baz'
styles.Foo; // 'Foo'
styles.Zed; // 'Zed'
```

This ensures snapshots are unaffected by unrelated changes.

> [!WARNING]
> This loader does not differentiate classes vs ids; thus duplicate names can create a last-wins conflict. For example `#Foo` and `.Foo` will result in just `Foo: 'Foo'`. This is unlikely to cause any real-world problems (and you probably shouldn't be doing this anyway).
