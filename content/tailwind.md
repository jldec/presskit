---
date: 2024-07-20
title: Tailwind
---
[Home](/) | [new-thing](new-thing) | [multi-page](multi-page) | [tailwind](tailwind) | [summarize](summarize)

# Tailwind

Adding [Tailwind CSS](https://tailwindcss.com/) to a hono-based worker took some time to figure out.

I wanted to introduce Tailwind without necessarily also changing the build toolchain (vite instead of wrangler) or changing the deployment model to Cloudflare Pages from vanilla workers.

This implementation runs the tailwind build separately, using the tailwind CLI, and deploys the resulting css files using the the (deprecated) static `[site]` feature of workers. 

The original inspiration for this approach came from https://github.com/craigsdennis/vanilla-chat-workers-ai/blob/main/package.json (thanks Craig!)

See also https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
