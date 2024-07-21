import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { StatusCode } from 'hono/utils/http-status'
import { raw } from 'hono/html'
import { parseFrontmatter } from './parse/frontmatter'
import { parseMarkdown } from './parse/markdown'
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

app.get('/static/*', serveStatic({ root: './', manifest }))

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/presskit/main/content'
const indexFile = 'index.md'

async function getContent(url: string) {
	try {
		const response = await fetch(url)
		const parsedContent = parseFrontmatter(await response.text())

		return {
			statusCode: response.status as StatusCode,
			attrs: parsedContent.attrs,
			html: parseMarkdown(parsedContent.body)
		}
	} catch (error) {
		return {
			statusCode: 500 as StatusCode,
			attrs: {},
			html: (error as any).message as string
		}
	}
}

// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
app.use(async (c, next) => {
	c.setRenderer((htmlContent) => {
		return c.html(
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link href="static/css/style.css" rel="stylesheet" />
				</head>
				<body>
					<div class="p-4">
					<div class="prose mx-auto ">{raw(htmlContent)}</div>
					</div>
				</body>
			</html>
		)
	})
	await next()
})

app.get('/', async (c) => {
	const content = await getContent(`${fileUrlPrefix}/${indexFile}`)
	c.status(content.statusCode)
	return c.render(content.html)
})

// Translate request path into file URL, including .md extension
// https://hono.dev/docs/api/routing#including-slashes
app.get('/:path{.+$}', async (c) => {
	const { path } = c.req.param()
	const content = await getContent(`${fileUrlPrefix}/${path}.md`)
	c.status(content.statusCode)
	return c.render(content.html)
})

export default app
