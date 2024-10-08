# html-inline-css-rspack-plugin

Forked the `html-inline-css-webpack-plugin` and modified it to be compatible with `rspack`

---

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Runjuu/html-inline-css-webpack-plugin/pulls)
[![Total downloads](https://img.shields.io/npm/dm/html-inline-css-webpack-plugin.svg)](https://www.npmjs.com/package/html-inline-css-webpack-plugin)
[![npm version](https://badge.fury.io/js/html-inline-css-webpack-plugin.svg)](https://www.npmjs.com/package/html-inline-css-webpack-plugin)

Convert external stylesheet to embedded stylesheet, aka document stylesheet.
```
<link rel="stylesheet" /> => <style>...<style/>
```

Require `rspack.CssExtractRspackPlugin` and `rspack.HtmlRspackPlugin`

## Install
#### NPM
```bash
npm i html-inline-css-rspack-plugin -D
```
#### Yarn
```bash
yarn add html-inline-css-rspack-plugin -D
```

## Minimal example
```js
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HTMLInlineCSSWebpackPlugin = require("html-inline-css-rspack-plugin").default;
import { rspack } from '@rspack/core';
import { HTMLInlineRspackPlugin } from 'html-inline-css-rspack-plugin'

module.exports = {
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css"
    // }),
    // new HtmlWebpackPlugin(),
    new rspack.CssExtractRspackPlugin({}),
    new rspack.HtmlRspackPlugin(options);
    new HTMLInlineRspackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
        type: 'javascript/auto',
      },
    ]
  }
}
```

----

> Keep the original config as `html-inline-css-webpack-plugin`.

## Config
```typescript
interface Config {
  filter?: (fileName: string) => boolean
  styleTagFactory?: (params: { style: string }) => string
  leaveCSSFile?: boolean
  replace?: {
    target: string
    position?: 'before' | 'after'
    removeTarget?: boolean
  }
}
```

### filter(optional)
```typescript
filter?: (fileName: string) => boolean
```
Return `true` to make current file internal, otherwise ignore current file. Include both css file and html file name.
##### example
```typescript
...
new HTMLInlineRspackPlugin({
  filter(fileName) {
    return fileName.includes('main');
  },
}),
...
```

### styleTagFactory(optional)
```typescript
styleTagFactory?: (params: { style: string }) => string
```

Used to customize the style tag.

##### example
```typescript
...
  new HTMLInlineRspackPlugin({
    styleTagFactory({ style }) {
      return `<style type="text/css">${style}</style>`;
    },
  }),
...
```

### leaveCSSFile(optional)
if `true`, it will leave CSS files where they are when inlining

### replace(optional)
```typescript
replace?: {
  target: string
  position?: 'before' | 'after' // default is 'before'
  removeTarget?: boolean // default is false
}
```
A config for customizing the location of injection, default will add internal style sheet before the `</head>`
#### target
A target for adding the internal style sheet
#### position(optional)
Add internal style sheet `before`/`after` the `target`
#### removeTarget(optional)
if `true`, it will remove the `target` from the output HTML
> Please note that HTML comment is removed by default by the `html-webpack-plugin` in production mode. [#16](https://github.com/Runjuu/html-inline-css-webpack-plugin/issues/16#issuecomment-527884514)
##### example
```html
<head>
    <!-- inline_css_plugin -->
    <style>
        /* some hard code style */
    </style>
</head>
```

```typescript
...
  new HTMLInlineRspackPlugin({
    replace: {
      removeTarget: true,
      target: '<!-- inline_css_plugin -->',
    },
  }),
...
```
###### output:
```html
<head>
    <style>
        /* style from *.css files */
    </style>
    <style>
        /* some hard code style */
    </style>
</head>
```
