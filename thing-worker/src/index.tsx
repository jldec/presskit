import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { StatusCode } from 'hono/utils/http-status'
import { raw } from 'hono/html'
import { parseFrontmatter } from './parse/frontmatter'
import { parseMarkdown } from './parse/markdown'

const app = new Hono()

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/thing/main/content'
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
			atts: {},
			html: (error as any).message as string
		}
	}
}

// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
app.use(async (c, next) => {
	c.setRenderer((htmlContent) => {
		return c.html(
			<html>
				<head>
					<Style>{css`
						html {
							font-family: Arial, Helvetica, sans-serif;
							line-height: 1.4;
							margin: 1em;
						}
						img {
							max-width: 100%;
						}
						.content {
							max-width: 50em;
							margin: auto;
							color: #333;
						}
						a {
							color: #55d;
						}
					`}</Style>
				</head>
				<body class="content">{raw(htmlContent)}</body>
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
