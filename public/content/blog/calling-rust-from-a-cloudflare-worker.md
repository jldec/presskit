---
title: Calling Rust from a Cloudflare Worker
splash:
  image: images/moonbird.jpg
date: 2021-02-14
excerpt: How to build a Worker which calls a WebAssembly library written in Rust.
---

# Calling Rust from a Cloudflare Worker

From the [WebAssembly spec](https://webassembly.github.io/spec/core/intro/introduction.html):

> WebAssembly (abbreviated wasm) is a safe, portable, low-level code format designed for efficient execution and compact representation.

WebAssembly is the first new runnable format supported by all major browsers. It is also showing promise as a standardized way to deploy code to edge environments.

Rust is a popular language for writing code compiled to WebAssembly. This is not just because of Rust's minimal runtime needs, but also because of its community and [tools](forays-from-node-to-rust).

## Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com/) offers a low-cost, low-latency, serverless platform, making it an ideal complement for statically generated websites. Cloudflare Workers use [V8](https://github.com/v8/v8#readme), the same open source JavaScript engine from Google which is used in [Node.js](https://nodejs.org/en/about/) and [Deno](https://deno.land/).

The [APIs](https://developers.cloudflare.com/workers/runtime-apis) available to Cloudflare Workers are very limited - Unlike Node, there is no module loader and no access to the host platform.

> Workers handle requests from the Web,  
> and they can call other Web services.

While the default JavaScript is already quite efficient, workers can also run WebAssembly.

## Creating the worker

This article demonstrates how to build a worker which calls a wasm [function](https://github.com/jldec/shortscale-rs) written in Rust.

The Cloudflare UI makes it easy to create new workers, but adding WebAssembly requires [API calls](https://api.cloudflare.com/#worker-script-upload-worker) with wasm [Resource Bindings](https://developers.cloudflare.com/workers/platform/scripts#resource-bindings). Since this part of the API is not well documented, using the **wrangler** CLI is easier.

[Install wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) and authenticate with `wrangler login`. Then run the following:

```sh
$ wrangler generate wasm-worker -t rust
```
```
🔧   Creating project called `wasm-worker`...
✨   Done! New project created ./wasm-worker
🕵️  You will need to update the following fields in the created wrangler.toml file before continuing:
🕵️  You can find your account_id in the right sidebar of your account's Workers page, and zone_id in the right sidebar of a zone's overview tab at https://dash.cloudflare.com
- account_id
```

This creates a directory called `wasm-worker` populated with files from [github.com/cloudflare/rustwasm-worker-template](https://github.com/cloudflare/rustwasm-worker-template/tree/72d390bf22983d43a1da3681faa093874fa32837).

## wrangler dev

You can now call `wrangler dev` to build and run the worker.

_Note_: There is no need to run 'wasm-pack' as suggested by the project README, and as of wrangler [v1.18.0](https://github.com/cloudflare/wrangler/releases/tag/v1.18.0), your 'account _id' will be auto-inferred by wrangler, if omitted from wrangler.toml.

```
$ wrangler dev
🌀  Compiling your project to WebAssembly...
[INFO]: 🎯  Checking for the Wasm target...
[INFO]: 🌀  Compiling to Wasm...
...
   Compiling wasm-worker v0.1.0
    Finished release [optimized] target(s) in 12.43s
[INFO]: ⬇️  Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: ✨   Done in 13.03s
[INFO]: 📦   Your wasm pkg is ready to publish at wasm-worker/pkg.
💁  watching "./"
👂  Listening on http://127.0.0.1:8787
```
Now browse to http://127.0.0.1:8787

!['Hello wasm-worker!' appears in the browser](images/hello-wasm-worker.png)

## Modifications

For learning purposes, I pared the code down and pushed it to [jldec/wasm-worker](https://github.com/jldec/wasm-worker).

- Removed unused files: `.appveyor.yml`, `.travis.yml`, `.cargo-ok`
- Removed `worker/metadata_wasm.json` - no longer used by wrangler
- Removed optional libraries `console_error_panic_hook`, `wee_alloc`, and `cfg-if`
- Updated version of `wasm-bindgen`
- Filled in `description`, `license`, and `repository` in `Cargo.toml`
- Added `Cargo.lock` to `.gitignore`
- Rewrote the README

I added the [shortscale](https://crates.io/crates/shortscale) crate, and changed `src/lib.rs`.

```rust
use shortscale::shortscale;

#[wasm_bindgen]
pub fn numwords(num: u64) -> String {
    return shortscale(num);
}
```

This is called from the `worker.js`.

```js
// Return JSON using query param n.
async function handleRequest(request) {

  // pick up #[wasm_bindgen] exports from ../src/lib.rs
  const { numwords } = wasm_bindgen;

  // `wasm` binding name is auto-generated by wrangler
  await wasm_bindgen(wasm);

  let hello = 'from wasm-worker';
  let url = new URL(request.url);
  let n = url.searchParams.get('n');
  let words;

  try {
    words = numwords(BigInt(n));
  }
  catch (e) {
    words = 'undefined';
  }

  return new Response(JSON.stringify({ hello, n, words }),
    {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    }
  );
}
```

## wrangler publish

Finally, I added a route and zone ID to my wrangler.toml and called `wrangler publish`

```
$ wrangler publish
🌀  Compiling your project to WebAssembly...
[INFO]: 🎯  Checking for the Wasm target...
[INFO]: 🌀  Compiling to Wasm...
    Finished release [optimized] target(s) in 0.03s
[INFO]: ⬇️  Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: ✨   Done in 0.47s
[INFO]: 📦   Your wasm pkg is ready to publish at wasm-worker/pkg.
✨  Build succeeded
✨  Successfully published your script to
 jldec.net/wasm-worker* => stayed the same
 https://wasm-worker.jldec.workers.dev
```

You can run the result at https://jldec.net/wasm-worker?n=123456789012345678 - Round-trip response times in my area average under 30ms.

![hello	"from wasm-worker" n "123456789012345678" words	"one hundred and twenty three quadrillion four hundred and fifty six trillion seven hundred and eighty nine billion twelve million three hundred and forty five thousand six hundred and seventy eight"](images/worker-request.png)


##  🦀 Keep 🦀 Digging 🦀

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/calling-rust-from-a-cloudflare-worker-17b4)_
