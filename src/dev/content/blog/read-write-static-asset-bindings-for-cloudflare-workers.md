---
title: Read-write Static Assets bindings for Cloudflare Workers
date: 2024-10-03
splashimage: /images/berries.webp
layout: BlogPostLayout
---

# Read-write Static Assets bindings for Cloudflare Workers

When Cloudflare announced their new [static assets](https://jldec.me/blog/building-a-static-site-with-cloudflare-workers) feature for workers last week, I was happy to see support for [assets bindings](https://developers.cloudflare.com/workers/static-assets/binding/#binding)

Bindings provide API access to other services from your worker. You can even call other workers. I recommend reading both blog posts by [Kenton Varda](https://x.com/kentonvarda) about [bindings](https://blog.cloudflare.com/workers-environment-live-object-bindings/) and [RPC](https://blog.cloudflare.com/javascript-native-rpc/).

Workers can already use the new `assets` binding to `GET` static assets which were uploaded as part of the worker deployment.

BUT what if workers could also create, update, or delete assets using the assets binding API? This would enable workers to render and serve static content directly.

### What about KV or R2?

Workers can write to [KV](https://developers.cloudflare.com/kv/) and [R2](https://developers.cloudflare.com/r2), so why not use those services instead, particularly since R2 already supports large objects, CORS, and http headers?

The short answer is that KV and R2 feel like lower level storage services.

Serving static assets requires additional features like handling trailing slashes, and serving `index.html` files for directory routes, `_redirects` configuration, and SPA support.

Layering the assets API on top of KV and R2 might make sense, perhaps with the use of a DO (Durable Object) for consistency.

### KISS

Another benefit of serving static assets is that they work without running worker code.

Static assets are simple and cheap and easy to operate reliably. And, the platform can handle caching, making them faster.

### The Web FTW

Wouldn't it be awesome if Cloudflare consumers could self-host their own content creation tools, and self-publish on the Web?

Creating content for the Web is not just a developer activity. One of the goals of [Presskit](/) is to enable web publishing without installs or build steps.

> The Web is for everyone 🚀🚀