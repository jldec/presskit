---
date: 2024-07-15
title: Serve Multiple Pages
---

Continuing the [New Thing](new-thing), today's goal is to improve our worker to serve an index page and multiple content pages, and to make the content look nicer.

- [x] Hardwire the route for the index page at '/' to point to `index.md`.
- [x] Instead of hardwiring each page route, use the request path to fetch content pages.
- [x] Return 404 if the page for a URL is not found.
- [ ] Use a library to parse yaml frontmatter, and convert markown to HTML.

## New markdown files
![Screenshot 2024-07-16 at 13 08 28](https://github.com/user-attachments/assets/32ea520a-2e12-489a-b003-77f6ab89e9d8)

## Hono routes
For the first commit we just deal with routing.

- Modify the hono worker code to handle root and other paths.
- Pass through fetch status e.g. 404 when the file is not found.
- Configure VS Code to attach debugger to local wrangler and confirm behavior.

![Screenshot 2024-07-16 at 14 13 26](https://github.com/user-attachments/assets/feb798c2-16bc-43fd-b1e2-0421550b4f2e)

![Screenshot 2024-07-16 at 14 07 15](https://github.com/user-attachments/assets/38331b9d-f9a4-47af-be30-e65eb4e282c2)

## Markdown to HTML
