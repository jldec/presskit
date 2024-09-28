---
title: Building a static site with cloudflare workers
layout: BlogPostLayout
date: 2024-09-27
---
# Building a static site with cloudflare workers

Cloudflare recently announced some [new features](https://blog.cloudflare.com/builder-day-2024-announcements/) including [this one](https://blog.cloudflare.com/builder-day-2024-announcements/#static-asset-hosting) for serving static files.

Here's how you can deploy a static site from scratch. Find the site at [minimal-static-site.jldec.workers.dev](https://minimal-static-site.jldec.workers.dev), source in [github](https://github.com/jldec/minimal-static-site).

[![minimal-static-site.jldec.workers.dev](/images/minimal-static-site.jldec.workers.dev.webp)](https://minimal-static-site.jldec.workers.dev)

### 1. Create an empty directory and install wrangler
These instructions assume that you already have [node](https://nodejs.org/) and [pnpm](https://pnpm.io/).
```sh
mkdir minimal-static-site
cd minimal-static-site
pnpm install wrangler
```

### 2. Create wrangler.toml
```toml
#:schema node_modules/wrangler/config-schema.json
name = "minimal-static-site"
compatibility_date = "2024-09-25"
assets = { directory = "./content" }
```
Note the new `assets` config, pointing to a content directory.

### 3. Provide your content/index.html

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

### 4. Ship it 🚢

```txt
$ pnpm wrangler deploy

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