---
date: 2024-07-15
title: Serve Multiple Pages
---

Continuing the [New Thing](new-thing), today's goal is to improve our worker to serve an index page and multiple content pages, and to make the content look nicer.

- [ ] Hardwire the route for the index page at '/' to point to `index.md`.
- [ ] Instead of hardwiring each page route, use the request path to fetch content pages.
- [ ] Return 404 if the page for a URL is not found.
- [ ] Use a library to parse yaml frontmatter, and convert markown to HTML.