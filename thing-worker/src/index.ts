import { Hono } from 'hono'
import { StatusCode } from 'hono/utils/http-status'

const app = new Hono()

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/thing/main/content'
const indexFile = 'index.md'

app.get('/', async (c) => {
	const response = await fetch(`${fileUrlPrefix}/${indexFile}`)
	return c.text(await response.text())
})

// Translate request path into file URL, including .md extension
// https://hono.dev/docs/api/routing#including-slashes
app.get('/:path{.+$}', async (c) => {
	const { path } = c.req.param()
	const response = await fetch(`${fileUrlPrefix}/${path}.md`)
	return c.text(await response.text(), response.status as StatusCode)
})

export default app
