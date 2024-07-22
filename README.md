## [pressskit.jldec.me](https://presskit.jldec.me/)
[![head](https://github.com/user-attachments/assets/31f4863c-977c-40c0-8a9d-8664151ac58a)](https://jldec.me/blog/what-web-publishing-should-be-like)

## What is this?
Presskit is an active exploration of ideas for [next-gen web publishin](https://jldec.me/blog/what-web-publishing-should-be-like).

### Basics
- Owners edit their "raw" content somewhere in a convenient format. For now that's GitHub and markdown + images.
- The content has a URL ie. your domain, and a page path/slug.
- The tool does the rest.

### Ideas
- The URL comes first, if it can be mapped to content it becomes a page, and 404 if not.
- Everything else about the page happens dynamically, potentially on-demand, and may change over time. E.g. conversion to HTML, processing of images, illustrations, styling. 
- Editing is a conversation with the tool. You can change the source content if you want to, but you can also tell the tool to add/remove/enhance the resulting output.

### Progress

1. [Published](https://presskit.jldec.me/new-thing) one unformatted [page](content/new-thing.md) at https://thing.jldec.me using [hono](https://hono.dev/).
  ![Screenshot 2024-07-16 at 11 28 09](https://github.com/user-attachments/assets/fea0cc4e-125b-4f14-84a6-c4b19385bc8d)

2. [Published](https://presskit.jldec.me/) multiple HTML pages at [presskit.jldec.me](https://presskit.jldec.me).  
   Deployed a new worker and a Clouldflare [redirect rule](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#redirect-all-requests-to-a-different-hostname) to redirect from 'thing' to 'presskit'.
  ![Screenshot 2024-07-17 at 13 07 41](https://github.com/user-attachments/assets/d43e5f3f-3d29-485d-882f-11a64c997213)

3. Added Tailwind CSS.

4. Added [AI generated summaries](https://presskit.jldec.me/summarize) while participating in [Cozy Hack SF](https://lu.ma/wco3g23k?tk=5aQXWb).
   ![cozy-content(2)](https://github.com/user-attachments/assets/43694062-5fcf-41a8-b2cb-45f201a6caf0)

