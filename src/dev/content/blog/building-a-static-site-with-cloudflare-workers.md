---
title: Building a static site with cloudflare workers
layout: BlogPostLayout
date: 2024-09-27
---
# Building a static site with cloudflare workers

Yesterday Cloudflare announced a slew of [new features](https://blog.cloudflare.com/builder-day-2024-announcements/) for the workers platform, including static asset hosting.

This makes it much easier to serve static files from the same endpoit as the request handlers in your workers code.

The following is all you need to build a static site, from scratch.
These instructions assume that tou have node and pnpm.

### create an empty directory
```sh
mkdir minimal-static-site
cd minimal-static-site
```

### install wrangler
```sh
pnpm install wrangler
```

### create wrangler.toml
```toml
#:schema node_modules/wrangler/config-schema.json
name = "minimal-static-site"
compatibility_date = "2024-09-27"
assets = { directory = "./content" }
```
Note the name of the content directory for assets.

### create content/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #255;
      }
      h1 {
        color: orange;
        font-size: 20vw;
        padding: 0.5ch;
      }
    </style>
  </head>
  <body>
    <h1>Hello👋 Workers</h1>
  </body>
</html>
```







```txt
$ pnpm ship

> @ ship /Users/jldec/cloudflare/minimal-static-site
> wrangler deploy


 ⛅️ wrangler 3.78.10
--------------------

🌀 Building list of assets...
🌀 Starting asset upload...
🌀 Found 1 new or modified file to upload. Proceeding with upload...
+ /index.html
Uploaded 1 of 1 assets
✨ Success! Uploaded 1 file (1.68 sec)

Total Upload: 0.34 KiB / gzip: 0.24 KiB
Uploaded minimal-static-site (9.81 sec)
Deployed minimal-static-site triggers (5.77 sec)
  https://minimal-static-site.jldec.workers.dev
Current Version ID: d0ecd041-b9a3-4e89-b168-baa394567839
```