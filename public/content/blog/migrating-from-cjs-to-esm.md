---
title: Migrating from CommonJS to ESM
splash:
  image: images/calm.jpg
date: 2021-01-23
excerpt: How to migrate from CommonJS to EcmaScript Modules.
---

# Migrating from CommonJS to ESM

[Node.js](https://nodejs.org/en/docs/guides/getting-started-guide/) opened the door for developers to build performant web servers using JavaScript.

The explosion of [CommonJS](https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules) modules which followed, created a massive new ecosystem. Building a typical website today involves hundreds, if not thousands, of modules.

To publish a module, you set `module.exports` in your code, create a `package.json` file, and run `npm publish`.

To consume a module, you add a dependency to your `package.json` file, run `npm install`, and call `require('module-name')` from your code.

Modules can depend on other modules.

[Npm](https://docs.npmjs.com/about-npm) moves module files between a central registry and the machines running Node.js.

## ESM modules

In [2015](https://262.ecma-international.org/6.0/#sec-ecmascript-language-scripts-and-modules), `import` and `export` statements were added to JavaScript. ESM module loading is now a built-in feature of [all major browsers](https://caniuse.com/mdn-javascript_statements_import) (sorry IE.)

ESM removes the need for package.json files, and uses URLs instead of npm module names -- but it does not preclude those from being used with ESM, say in a Node.js context.

To publish an ESM module, use `export` in your code, and make the file fetchable by URL.

To consume an ESM module, use `import { ... } from URL`. See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) for more details.

Using `import` instead of `require()` allows ESM modules to be loaded independently, without running the code where they are used. A variant of the `import` statement, is the [dynamic import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) function. This allows for modules to be loaded asynchronously at run-time.

> ESM is the basis for exciting new developer tools like [Snowpack](https://github.com/snowpackjs/snowpack#readme) and [Vite](https://github.com/vitejs/vite#readme).

## So, why are most modules still published with CommonJS?

Even before ESM, developers could use npm modules in front-end code.  Tools like [browserify](https://github.com/browserify/browserify#readme) or [webpack](https://github.com/webpack/webpack#readme) bundle modules into a single script file, loadable by browsers.

On the server side, it has taken Node.js a few years to arrive at [ESM support](https://nodejs.org/api/packages.html#packages_determining_module_system). Unfortunately, the 2 standards are not fully interoperable.

Despite everyone's best intentions, the [Node.js docs](https://nodejs.org/api/esm.html#esm_interoperability_with_commonjs) are unclear about what to do. For a deeper explanation, I recommend [this article](https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1) by Dan Fabulich.

Here is a summary of some interop scenarios:

#### require() from default Node.js context
- require("CommonJS-module") - **Yes ✅**, this has always worked and is the default.
- require("ESM-module") - **No ❌**.
- require("Dual-ESM-CJS-module") - **Yes ✅**, but be careful with state.

#### import statement from Node.js ESM context - E.g. in a server.mjs file.
- import from "ESM-module" - **Yes ✅**.
- import default from "CommonJS-module" - **Yes ✅**.
- import { name } from "CommonJS-module" - **No ❌**, get default.name from 2.

## Dynamic Import as a fallback
Node's inability to require() ESM modules prevents simple upgrades from CommonJS to ESM.

Publishing [dual](https://nodejs.org/dist/latest-v15.x/docs/api/packages.html#packages_dual_commonjs_es_module_packages) ESM-CJS packages is messy because it involves [wrapping](https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1#6b50) CommonJS modules in ESM. Writing a module using ESM and then wrapping it for CommonJS is not possible.

Fortunately, [dynamic import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) provides an alternative.

Dynamic import() works from the default Node.js context as well as from an ESM context. You can even import() CJS modules. The only gotcha is that it returns a promise, so it is not a drop-in replacement for require().

Here is an example showing require() and import() together.

I published [shortscale](https://github.com/jldec/shortscale) v1 as CommonJS. For [v2 and later](https://github.com/jldec/shortscale/pull/2) the module is only available as ESM. This means that later releases can no longer be loaded using Node.js require().

This [fastify server](https://github.com/jldec/demo-fastify-esm) loads both module versions from a CJS context.

```js
// minimal fastify server based on:
// https://www.fastify.io/docs/latest/Getting-Started/#your-first-server

const fastify = require('fastify')({ logger: true });

fastify.register(async (fastify) => {
  let shortscale_v1 = require('shortscale-v1');
  let shortscale_v4 = (await import('shortscale-v4')).default;

  // e.g. http://localhost:3000/shortscale-v1?n=47
  fastify.get('/shortscale-v1', function (req, res) {
    let num = Number(req.query.n);
    let str = '' + shortscale_v1(num);
    res.send({num, str});
  });

  // e.g. http://localhost:3000/shortscale-v4?n=47
  fastify.get('/shortscale-v4', function (req, res) {
    let num = Number(req.query.n);
    let str = '' + shortscale_v4(num);
    res.send({num, str});
  });
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
```

For this demo, `package.json` installs both versions of shortscale.

```json
{
  "name": "demo-fastify-esm",
  "version": "1.0.0",
  "description": "Demonstrate ESM dynamic import from non-ESM server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "author": "Jürgen Leschner",
  "license": "MIT",
  "dependencies": {
    "fastify": "^3.11.0",
    "shortscale-v1": "npm:shortscale@^1.1.0",
    "shortscale-v4": "npm:shortscale@^4.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/jldec/demo-fastify-esm"
  }
}
```

> I plan to migrate my modules to ESM. Other [module authors](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77) are too.

> 📦📦

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/migrating-from-commonjs-to-esm-2p24)_


