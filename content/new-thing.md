---
date: 2024-07-15
title: New Thing
---

# New Thing
I have started a new thing.  
The goal is to have fun, and build something useful.  
If it works you can have fun and build something useful too.

#### today
- [x] Create a git repo https://github.com/jldec/thing with a markdown file.
- [x] Deploy a cloudflare worker https://thing.jldec.me/ to publish the markdown file.

## pnpm create hono
![Screenshot 2024-07-15 at 15 02 13](https://github.com/user-attachments/assets/8cb9e73c-2675-457f-9f5b-dd80e6042da4)

## create a new GitHub repo
![Screenshot 2024-07-15 at 15 21 46](https://github.com/user-attachments/assets/d7b0c0b0-61c4-4c4d-8d4d-339d3f803c78)

## index.ts worker code
```ts
import { Hono } from 'hono'

const app = new Hono()

const fileUrl = 'https://raw.githubusercontent.com/jldec/thing/main/content/new-thing.md'

app.get('/', async (c) => {
	const req = await fetch(fileUrl)
	return c.text(await req.text())
})

export default app
```

## 🚢 the Cloudflare worker
![Screenshot 2024-07-15 at 15 52 18](https://github.com/user-attachments/assets/bc11c1fd-5608-4bbb-aee2-6ccee64d8ff8)

### Add a Cloudflare custom domain
![Screenshot 2024-07-15 at 15 57 11](https://github.com/user-attachments/assets/14242b43-20b0-419d-ba6f-fce713e411b9)

### Bingo.
![Screenshot 2024-07-15 at 16 31 24](https://github.com/user-attachments/assets/b3a1d6e1-3a3b-4086-a4fe-cfa320870d96)

