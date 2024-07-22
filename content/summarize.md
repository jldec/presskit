---
date: 2024-07-21
title: Cache and summarize
---
[Home](/) | [new-thing](new-thing) | [multi-page](multi-page) | [tailwind](tailwind) | [summarize](summarize)

# Cache and Summarize content using AI
First steps using AI for content enrichment.
This was added while participating in [Cozy Hack SF](https://lu.ma/wco3g23k?tk=5aQXWb)

- Content is fetched from file the first time the page is requested
- The page content is rendered immediately to avoid waiting
- An AI generated summary is added to the cached content in Workers KV, and served back in subsequent requests.

![cozy-content(2)](https://github.com/user-attachments/assets/43694062-5fcf-41a8-b2cb-45f201a6caf0)
