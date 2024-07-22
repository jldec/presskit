---
date: 2024-07-16
title: Serve Multiple Pages
---
[Home](/) | [new-thing](new-thing) | [multi-page](multi-page) | [tailwind](tailwind) | [summarize](summarize)

# Serve multiple pages

Continuing the [New Thing](new-thing), today's goal is to improve our worker to serve an index page and multiple content pages, and to make the content look nicer.

- [x] Create a route for the index page at '/' pointing to `index.md`.
- [x] Instead of hardwiring each page route, use the request path to fetch content pages.
- [x] Return 404 if the page for a URL is not found.
- [x] Use a library to parse yaml frontmatter, and convert markown to HTML.
- [x] Add rudimentary CSS styling.

#### Create new markdown files
![Screenshot 2024-07-16 at 13 08 28](https://github.com/user-attachments/assets/32ea520a-2e12-489a-b003-77f6ab89e9d8)

#### Add Hono routes
For the first commit we just dealt with routing.

- Modify the hono worker code to handle root and other paths.
- Pass through fetch status e.g. 404 when the file is not found.
- Configure VS Code to attach debugger to local wrangler and confirm behavior.

![Screenshot 2024-07-16 at 14 13 26](https://github.com/user-attachments/assets/feb798c2-16bc-43fd-b1e2-0421550b4f2e)

![Screenshot 2024-07-16 at 14 07 15](https://github.com/user-attachments/assets/38331b9d-f9a4-47af-be30-e65eb4e282c2)

#### Parse Markdown to generate HTML
This part required 2 new dependencies. To process yaml frontmatter I chose https://jsr.io/@std/front-matter because it appears to be actively maintained and I like the new api. To parse markdown I chose https://www.npmjs.com/package/markdown-it in anticipation of offering extensions like [Vitepress](https://vitepress.dev/guide/markdown).

#### Add basic CSS
https://presskit.jldec.me/  
This is just enough CSS to constrain with page width and center the content with a sans-serif font. 
![Screenshot 2024-07-17 at 13 07 41](https://github.com/user-attachments/assets/d43e5f3f-3d29-485d-882f-11a64c997213)

#### [Next](tailwind)
- introduce TailwindCSS.
- Generate index and nav using directory listing of content files and frontmatter.  
