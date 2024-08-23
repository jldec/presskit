---
title: Progress
---
# Progress

1. [Published](https://presskit.jldec.me/new-thing) one unformatted [page](content/new-thing.md) at https://thing.jldec.me using [hono](https://hono.dev/).
  ![Screenshot 2024-07-16 at 11 28 09](https://github.com/user-attachments/assets/fea0cc4e-125b-4f14-84a6-c4b19385bc8d)

2. [Published](https://presskit.jldec.me/) multiple HTML pages at [presskit.jldec.me](https://presskit.jldec.me).  
   Deployed a new worker and a Clouldflare [redirect rule](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#redirect-all-requests-to-a-different-hostname) to redirect from 'thing' to 'presskit'.
  ![Screenshot 2024-07-17 at 13 07 41](https://github.com/user-attachments/assets/d43e5f3f-3d29-485d-882f-11a64c997213)

3. Added Tailwind CSS.

4. Added [AI generated summaries](https://presskit.jldec.me/summarize) while participating in [Cozy Hack SF](https://lu.ma/wco3g23k?tk=5aQXWb).
   ![cozy-content(2)](https://github.com/user-attachments/assets/43694062-5fcf-41a8-b2cb-45f201a6caf0)

5. Used [daisyUI](https://presskit.jldec.me/daisyui) for responsive [navbar/navbar](https://daisyui.com/components/drawer/#navbar-menu-for-desktop--sidebar-drawer-for-mobile) navigation.  
  ![Screenshot 2024-07-29 at 19 16 29](https://github.com/user-attachments/assets/1ac24765-86a0-44c2-9110-982ffbc1d1f7)

6. Auto-migrate images to R2. [Rewrite](/packages/worker/src/markdown/rewrite-url.ts) image urls to point to `/img/<hash>?og=<original-url>` during markdown to html rendering. The /img/* handler tries to fetch from R2 first, and falls back to using the og url and then uploading to R2. The hash includes a secret prefix (salt), to make it hard to inject images bypassing the markdown processor. TODO: cache-control headers.

7. Multi-person chat. Started work on this during the Cloudflare WorkersAI Virtual Hack Camp. Used Sunil Pai's [durable-chat template](https://github.com/threepointone/durable-chat). Pushed nicer daisyUI message bubbles and localstorage persisted names a few days later.