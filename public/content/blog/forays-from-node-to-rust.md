---
title: Forays from Node to Rust
splash:
  image: images/fog.jpg
date: 2021-01-10
excerpt: This article covers the experience of buiding my first Rust crate.
---

# Forays from Node to Rust

A couple of years ago I picked up the excellent [Programming Rust](https://www.oreilly.com/library/view/programming-rust/9781491927274/) book.

Reading how the Rust compiler enforces memory safety and avoids data-races reminded me of the AHA! moment, when I learned how [Node.js](https://nodejs.org/en/about/) makes concurrency accessible to JavaScript developers, without the synchronization headaches of multi-threaded servers.

But there's more. Rust programs have a very minimal runtime - no garbage collector or class loader. This makes Rust ideal for constrained environments like embedded systems or edge compute platforms - so watch [this](https://github.com/oxidecomputer) [space](https://github.com/bytecodealliance).

## First impressions

This article covers the experience of buiding my first Rust crate.

The [shortscale-rs](https://github.com/jldec/shortscale-rs) library tries to replicate [shortscale](https://github.com/jldec/shortscale), a small JavaScript module with just one function which converts numbers to English words.

The [Rust ecosystem](https://www.rust-lang.org) has produced an absolutely awesome array of tools and documentation.

To get started:
- Install Rust [using rustup](https://www.rust-lang.org/tools/install).
- Run 'rustup update' whenever there is a new [Rust release](https://github.com/rust-lang/rust/releases).

Those steps also take care of 'cargo', the Rust build tool.

![Image showing cargo commands](images/cargo.png)  
_https://www.rust-lang.org/learn/get-started_

## VS Code

I followed the [recommendations](https://jason-williams.co.uk/debugging-rust-in-vscode) of Jason Williams to install [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) for VS Code instead of the default Rust extension. You'll also need [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) for debugging.

![VS Code showing Rust program](images/vs-code-rust.png)  
I particularly like the ability to run doctests directly in the VS Code terminal.

## Rust String and str

In **JavaScript** building strings is straightforward. Simply use `+` to concatenate any string to any other string. Empty strings being [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) helps to write very compact logic.

The example below from [shortscale.js](https://github.com/jldec/shortscale/blob/main/shortscale.js#L96) behaves like the built-in [Array.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join), except that it avoids repeating separators by ignoring empty strings.

```js
// concatenate array of strings, separated by sep, ignoring '' values
function concat(strings, sep) {
  return strings.reduce((s1, s2) => s1 + (s1 && s2 ? sep : '') + s2, '')
}
```

Here's my [first attempt](https://github.com/jldec/shortscale-rs/blob/main/src/extra.rs#L374) to do something similar in **Rust**.

```rust
type Strvec = Vec<&'static str>;

// concatenate 2 Strvec's, separated with "and" if both have length
fn concat_and(v1: Strvec, v2: Strvec) -> Strvec {
    match (v1.len(), v2.len()) {
        (_, 0) => v1,
        (0, _) => v2,
        (_, _) => [v1, vec!["and"], v2].concat(),
    }
}
```

'Why Strvec?', you might ask. In Rust, the primitive string type, used for string literals, is a [str](https://doc.rust-lang.org/nightly/std/primitive.str.html). My first thought was that shortscale-rs should manipulate collections of str's. So, instead of using [String](https://doc.rust-lang.org/nightly/std/string/struct.String.html) concatenation, I put str's into [Vec](https://doc.rust-lang.org/nightly/std/vec/struct.Vec.html)'s.

Notice the elegant [match](https://doc.rust-lang.org/rust-by-example/flow_control/match.html) syntax - one of my favorite Rust language features. The compiler ensures that the 'arms' of the match cover all possible inputs. The result is both readable and concise. The '_' is shorthand for any value.

> Performance does not matter,  
> until it absolutely does.  
> [@matteocollina](https://twitter.com/matteocollina/status/1260887018617352192?s=20)

## Benchmarks

The measured [performance](https://github.com/jldec/shortscale-rs#extra) was, well, an eye-opener! ~4459ns per [shortscale_vec_concat](https://docs.rs/shortscale/1.3.2/src/shortscale/extra.rs.html#314-336) call in Rust, compared to ~1342ns for the equivalent in Node.js.

[cargo bench](https://github.com/jldec/shortscale-rs/blob/main/benches/bench-shortscale.rs)
```
shortscale                          251 ns/iter (+/- 18)
shortscale_string_writer_no_alloc   191 ns/iter (+/- 11)
shortscale_str_push                 247 ns/iter (+/- 22)
shortscale_vec_push                 363 ns/iter (+/- 26)
shortscale_display_no_alloc         498 ns/iter (+/- 21)
shortscale_vec_concat              4459 ns/iter (+/- 344)
shortscale_string_join             5549 ns/iter (+/- 378)
```

[npm run bench](https://github.com/jldec/shortscale/blob/main/test/bench.js)
```
shortscale                         1342 ns/iter
```

Clearly the v8 JavaScript engine in Node.js is working very hard to make string manipulation efficient.

## Learn & Iterate

The next thing I tried was to replace the Vec collections with simple Strings, creating and returning those from each function in the Rust program. This is [shortscale_string_join](https://docs.rs/shortscale/1.3.2/src/shortscale/extra.rs.html#389-406). You should see from the benchmark, that its performance was _even worse_. Clearly I was doing something wrong.

Fast forward to the [current implementation](https://docs.rs/shortscale/1.3.2/src/shortscale/shortscale.rs.html#46-61), which mutates a pre-allocated String rather than calling functions which create and return new Strings.

> The result is significantly faster than JavaScript.

I still have a lot to learn, but this exercise was a great way to start building an intuition for Rust development and the performance of Rust primitives.

> 😎

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/forays-from-node-to-rust-3fk1)_

