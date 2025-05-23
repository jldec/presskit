
# Presskit ⚡️
Presskit is a simple git-backed Web + AI publishing platform. It does on-demand, serverless rendering on [Cloudflare workers](https://developers.cloudflare.com/workers/) (no build) and serves AI conversations using [Partykit](https://docs.partykit.io/how-partykit-works/). Content lives in GitHub. For an example project see [jldec.me](https://jldec.me?chat)

<img width="1337" alt="Screenshot 2025-05-06 at 07 21 17" src="https://github.com/user-attachments/assets/b38f2a7a-0f2d-4643-ba83-bf57f2e33f20" />

Evey page has it's own AI chat. Page content is part of the conversation context. Multiple users can participate in each page-specific conversation. Behind the scenes websockets connect to a [durable object](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/) instance per page, and chat history is saved as the durable object state.

Page content is versioned in markdown files in git. When content changes, pages can selectively re-render. There is no site-wide build. Pages are rendered on-demand and subsequently served from cache.

### future ideas
- Installable themes to render different layouts and presentation styles.
- Wiki-like collaboration with AI for page content creation and maintenance.
- Per-page history of conversations with humans and AI.
- End-to-end setup and content management by non-developers.
- Plugins for content sources e.g. CMS services
- Public and private pages
- Broader AI awareness of content (not just per-page)
- Site-level conversations
- Private conversations
- Conversation moderation
