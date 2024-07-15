import { Hono } from 'hono'

const app = new Hono()

const fileUrl = 'https://raw.githubusercontent.com/jldec/thing/main/content/new-thing.md'

app.get('/', async (c) => {
	const req = await fetch(fileUrl)
	return c.text(await req.text())
})

export default app
