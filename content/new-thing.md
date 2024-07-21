---
date: 2024-07-15
title: New Thing
---
[Home](/) | [new-thing](new-thing) | [multi-page](multi-page)

# New Thing
Publish content from GitHub with zero build using [hono](https://hono.dev/).
- [x] Create a git repo with a markdown file. https://github.com/jldec/presskit
- [x] Deploy a cloudflare worker to publish the markdown file. https://presskit.jldec.me/

####  pnpm create hono
https://hono.dev/docs/getting-started/cloudflare-pages#_1-setup
![Screenshot 2024-07-15 at 15 02 13](https://github.com/user-attachments/assets/8cb9e73c-2675-457f-9f5b-dd80e6042da4)

####  New GitHub repo
_The "thing" repo has since been renamed to "presskit"_
![Screenshot 2024-07-15 at 15 21 46](https://github.com/user-attachments/assets/d7b0c0b0-61c4-4c4d-8d4d-339d3f803c78)

####  Worker [code](https://github.com/jldec/presskit/blob/073e5a25898d1ff253604fbfdf919d76772ae3c4/thing-worker/src/index.ts)
```ts
import { Hono } from 'hono'

const app = new Hono()

const fileUrl = 'https://raw.githubusercontent.com/jldec/presskit/main/content/new-thing.md'

app.get('/', async (c) => {
	const req = await fetch(fileUrl)
	return c.text(await req.text())
})

export default app
```

####  Ship the worker
![Screenshot 2024-07-15 at 15 52 18](https://github.com/user-attachments/assets/bc11c1fd-5608-4bbb-aee2-6ccee64d8ff8)

####  Add a custom domain
![Screenshot 2024-07-15 at 15 57 11](https://github.com/user-attachments/assets/14242b43-20b0-419d-ba6f-fce713e411b9)

####  It works
![Screenshot 2024-07-16 at 11 28 09](https://github.com/user-attachments/assets/fea0cc4e-125b-4f14-84a6-c4b19385bc8d)

####  [Tweet](https://x.com/jldec/status/1812879762483990874)
![Screenshot 2024-07-15 at 16 58 01](https://github.com/user-attachments/assets/15407a94-e7c6-417f-98e4-06c266d42c70)

####  [Next](https://presskit.jldec.me/multi-page)
- Publish HTML with images instead of raw markdown
- Add more pages
