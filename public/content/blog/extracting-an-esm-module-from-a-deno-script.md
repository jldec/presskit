---
title: Extracting an ESM module from a Deno script
splash:
  image: images/persewide.jpg
date: 2021-03-21
excerpt: |
  How to extract an ESM module so that it can also be used with Node.js or in the browser.

  Will the NPM ecosystem evolve to support nested ESM modules, or will some other organization, with a workable trust model, emerge to replace it?
---

# Extracting an ESM module from a Deno script

This is another followup to my recent post about [Getting Started with Deno](getting-started-with-deno).

I thought it would make sense to extract the crawler code into its own [ESM module](migrating-from-cjs-to-esm) so that it can also be used with Node.js or in the browser.

The resulting [API](https://github.com/jldec/deno-hello/blob/main/scanurl.mjs#L18) is a bit ugly because it expects parse5 and fetch as parameters, but it works  .

```js
/**
 * @param {URL} rootURL
 * @param {boolean} noRecurse
 * @param {boolean} quiet
 * @param {function} parse5 - transitive dependency
 * @param {function} fetch - native or npm package
 * @param {Object} fetchOpts options passed to fetch - optional
 * @returns {Object} map of url -> { url, status, in, [error] }
 */
export default async function scanurl(rootURL, noRecurse, quiet, parse5, fetch, fetchOpts) {
```

## Calling the ESM module from the browser

You can try running the module from inside your own browser at https://deno-hello.jldec.me/.

[![Screenshot of https://deno-hello.jldec.me](images/deno-hello.jldec.me.png)](https://deno-hello.jldec.me/)

The page shows how to import the module from an inline `<script type="module">`.

```html
<script type="module" id="code">
import scanurl from './scanurl.mjs';
import parse5 from 'https://cdn.skypack.dev/parse5';
...
</script>
```

Note that the usual browser CORS restrictions also apply to ESM modules, and to fetch() calls. In this case 'scanurl' is imported using a relative path on the same origin, and 'parse5' is imported using https://www.skypack.dev/.

## Using the scanode ESM module with Node

I have published [scanode](https://www.npmjs.com/package/scanode) as a package on npm. If you have Node, you can run it with 'npx' or install it using 'npm install'.

```
$ npx scanode https://jldec.me
npx: installed 3 in 0.987s
parsing /
...
14 pages scanned.
🎉 no broken links found.
```

You can also call the module API from your own code as in [node_example/test-scan.js](https://github.com/jldec/deno-hello/blob/main/node_example/test-scan.js).

```js
import fetch from 'node-fetch';
import parse5 from 'parse5';
import scanode from 'scanode';

const result = await scanode(
  new URL('https://jldec.me'),
  false, // noRecurse
  false, // quiet
  parse5,
  fetch
);
```

Notice the imports for 'parse5' and 'node-fetch'. These are included as dependencies in the [package.json](https://github.com/jldec/deno-hello/blob/main/package.json#L9) for scanode.

```json
{
  "name": "scanode",
  "version": "2.0.1",
  "description": "ESM module - crawls a website, validating that all the links on the site which point to the same orgin can be fetched.",
  "main": "scanurl.mjs",
  "bin": {
    "scanode": "./bin/scanode.mjs"
  },
  "dependencies": {
    "node-fetch": "^2.6.1",
    "parse5": "^6.0.1"
  }
  ...
```

## So what's wrong with this picture?

As discussed [before](migrating-from-cjs-to-esm), the NPM ecosystem predates ESM modules, so the two worlds don't play very nicely together. Node.js programs cannot easily load ESM modules which are not in NPM. Meanwhile, browsers know nothing about package.json or the node_modules directory.

When ESM modules depend on other modules, they use 'import' statements with a URL or relative path. Node.js expects those sub-modules to be referenced by their NPM package names.

The result is that modules which depend on other modules are not portable between the two worlds, without an additional transformation step, or maybe an [import map](https://caniuse.com/import-maps).

And this is why, for now, the API above expects the `parse5` module dependency as a parameter.

> The big question is whether the NPM ecosystem will evolve to support nested ESM modules, or whether some other organization with a workable trust model will emerge to replace it.

Where there's a problem, there's an opportunity!

# 🚀

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/extracting-an-esm-module-from-a-deno-script-28il)_











