import { Hono } from 'hono'
import { StatusCode } from 'hono/utils/http-status'

const app = new Hono()

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/thing/main/content'
const indexFile = 'index.md'

async function getContent(url: string) {
	try {
		const response = await fetch(url)
		return {
			statusCode: response.status as StatusCode,
			text: await response.text()
		}
	} catch (error) {
		return {
			statusCode: 500 as StatusCode,
			text: (error as any).message as string
		}
	}
}

app.get('/', async (c) => {
	const content = await getContent(`${fileUrlPrefix}/${indexFile}`)
	return c.text(content.text, content.statusCode)
})

// Translate request path into file URL, including .md extension
// https://hono.dev/docs/api/routing#including-slashes
app.get('/:path{.+$}', async (c) => {
	const { path } = c.req.param()
	const content = await getContent(`${fileUrlPrefix}/${path}.md`)
	return c.text(content.text, content.statusCode)
})

export default app
