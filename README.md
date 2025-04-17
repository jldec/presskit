
# Presskit ⚡️
Presskit is a simple git-backed Web + AI publishing platform built on [Cloudflare workers](https://developers.cloudflare.com/workers/) and [Partykit](https://docs.partykit.io/how-partykit-works/).  
For an example project see [jldec.me](https://jldec.me?chat)

<img width="1184" alt="Screenshot 2025-04-17 at 11 35 54" src="https://github.com/user-attachments/assets/a8d2f4db-268f-415d-9feb-442d5d53902d" />

### currently working
- Evey page has it's own AI chat, the page content is part of the conversation context.
- Page content is versioned in markdown files in git.
- There is no site-wide build - pages are rendered on-demand and subsequently served from cache.
- When content changes, pages can selectively re-render.

### future ideas
- Wiki-like collaboration with AI for page content creation and maintenance.
- Per-page history of conversations with humans and AI.
- End-to-end setup and content management by non-developers.
- Installable themes for different layouts and presentations styles.
- Plugins for content sources or destinations e.g. CMS services
- Public and private pages
- Broad AI awareness of content (not just per-page)
- Site-level conversations
- Private conversations
- Conversation moderation
