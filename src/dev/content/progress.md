---
title: Progress
---
[Home](/)

# Progress

1. [Published](https://presskit.jldec.me/new-thing) one unformatted [page](content/new-thing.md) at https://thing.jldec.me using [hono](https://hono.dev/). The page is fetched from GitHub by a [Cloudflare worker](https://github.com/jldec/presskit/blob/073e5a25898d1ff253604fbfdf919d76772ae3c4/thing-worker/src/index.ts)

    ![Screenshot 2024-07-16 at 11 28 09](https://github.com/user-attachments/assets/fea0cc4e-125b-4f14-84a6-c4b19385bc8d)

1. [Published](https://presskit.jldec.me/) multiple HTML pages at [presskit.jldec.me](https://presskit.jldec.me).

    Deployed a new worker and a Clouldflare [redirect rule](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#redirect-all-requests-to-a-different-hostname) to redirect from 'thing' to 'presskit'.

1. Added Tailwind CSS.

1. Added [AI generated summaries](https://presskit.jldec.me/summarize) while participating in [Cozy Hack SF](https://lu.ma/wco3g23k?tk=5aQXWb). This feature has been been removed for now.

1. Used [daisyUI](https://presskit.jldec.me/daisyui) for responsive [navbar/navbar](https://daisyui.com/components/drawer/#navbar-menu-for-desktop--sidebar-drawer-for-mobile) navigation.

1. Auto-migrate images to R2.

    A plugin to the markdown parser [rewrites image urls](/src/worker/src/markdown/image-plugin.ts) to point to `/img/<hash>?og=<original-url>`.

    The /img/* handler tries to fetch from R2 first, and falls back to using the og url and then uploading to R2.

    The hash includes a secret prefix (salt), to make it hard to inject images bypassing the markdown processor. TODO: cache-control headers.

1. Multi-person chat.

    Started work on this during the Cloudflare WorkersAI Virtual Hack Camp. Used Sunil Pai's [durable-chat template](https://github.com/threepointone/durable-chat).

    Pushed nicer daisyUI message bubbles and localstorage persisted names a few days later.

1. Refactored the code. This is WIP - I want a squeaky clean index.ts like [this](https://github.com/charl-kruger/cursor-proxy/blob/main/src/index.ts).

1. Fetch markdown from file system during local development. The easiest way to implement this was to put the files inside the public folder.

1. Respect 'Cache-Control: no-cache' to reload markdown content and images from source on demand.

1. `layout` frontmatter property controls rendering layout per-page.

1. Added DaisyUI dropdown theme chooser.

1. Improved yaml-error and not-found behavior.

1. Replaced TailwindCSS and DaisyUI with [monospace CSS](https://github.com/owickstrom/the-monospace-web/blob/main/index.css) in an effort to simplify the stack, and reduce distraction.

