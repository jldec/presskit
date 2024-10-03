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

BUT what if workers could also create, update, or delete assets using the assets binding API? This would enable web publishing frameworks to render and publish static content directly from workers.

### What about KV or R2?

Workers can write to [KV](https://developers.cloudflare.com/kv/) and [R2](https://developers.cloudflare.com/r2), so why not use those services instead, particularly since R2 already supports large objects, CORS, and http headers?

One reason is that static assets services include additional features like serving `index.html` files for directories, and `_redirects` config.

Another reason is that serving static assets does not have to run any worker code. Static assets are simpler and cheaper and easier to operate reliably.

Finally the platform can handle caching (and cache purges) automatically for static assets, making them faster.

### The line between dev and non-dev

Creating content for the web is not just a developer activity. One of the goals of [Presskit](/) is to enable web publishing without installs or build steps.

#### Read-write static assets would be a win for workers.

## 🚀🚀