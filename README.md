# Presskit
Communicate your ideas on the Web today.

## What is this?
Presskit is an active exploration of [agentic AI for Web publishing](https://jldec.me/blog/what-web-publishing-should-be-like).  
[Worker code](https://github.com/jldec/presskit/blob/main/presskit-worker/src/index.tsx) and [markdown source content](https://github.com/jldec/presskit/tree/main/content) both live in this repo for now.

## The vision
- Presskit serves HTML websites. No coding is required.
- Users will start with a domain, enable Presskit, and activate their raw content sources.
- AI agents will convert raw content into fresh, easily consumable, discoverable URLs on the Web.
- Editorial tooling will provide users with fine-grained control.

##. Progress
1. [Published](https://presskit.jldec.me/new-thing) one unformatted [page](content/new-thing.md) at https://thing.jldec.me using [hono](https://hono.dev/).
  ![Screenshot 2024-07-16 at 11 28 09](https://github.com/user-attachments/assets/fea0cc4e-125b-4f14-84a6-c4b19385bc8d)

2. [Published](https://presskit.jldec.me/) multiple HTML pages at [presskit.jldec.me](https://presskit.jldec.me).  
   Deployed a new worker and a Clouldflare [redirect rule](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#redirect-all-requests-to-a-different-hostname) to redirect from 'thing' to 'presskit'.
  ![Screenshot 2024-07-17 at 13 07 41](https://github.com/user-attachments/assets/d43e5f3f-3d29-485d-882f-11a64c997213)

3. Added Tailwind CSS.

4. Added [AI generated summaries](https://presskit.jldec.me/summarize) while participating in [Cozy Hack SF](https://lu.ma/wco3g23k?tk=5aQXWb).
   ![cozy-content(2)](https://github.com/user-attachments/assets/43694062-5fcf-41a8-b2cb-45f201a6caf0)

5. Used [daisyUI](https://presskit.jldec.me/daisyui) for responsive [navbar/navbar](https://daisyui.com/components/drawer/#navbar-menu-for-desktop--sidebar-drawer-for-mobile) navigation.  
  ![Screenshot 2024-07-29 at 19 19 46](https://github.com/user-attachments/assets/6806f55b-2dd5-4801-b65f-464e914b6113)  
  ![Screenshot 2024-07-29 at 19 16 29](https://github.com/user-attachments/assets/1ac24765-86a0-44c2-9110-982ffbc1d1f7)

## Coming soon

- Configurable sources. (currently hardwired to this repo)
- Image caching, image processing, and link-rewriting (a.t.m images are fully qualified, unproxied urls)
- Auto-discover content, generate sidebar for docs like [gitkit](https://gitkitjs.dev/).
- More AI enrichment.
- Content editing.
- Pluggable themes.
