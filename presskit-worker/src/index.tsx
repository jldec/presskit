import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { StatusCode } from 'hono/utils/http-status'
import { raw } from 'hono/html'
import { parseFrontmatter } from './parse/frontmatter'
import { parseMarkdown } from './parse/markdown'

// @ts-expect-error
// TODO - figure out if this is required.
// followed: https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
// see also: https://github.com/honojs/hono/issues/1127
import manifest from '__STATIC_CONTENT_MANIFEST'

type Bindings = {
	page_cache: KVNamespace
	AI: Ai
	GH_PAT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/static/*', serveStatic({ root: './', manifest }))

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/presskit/main/content'
const indexFile = 'index.md'

type Content = {
	statusCode: StatusCode
	attrs: any
	html: string
	summary?: AiSummarizationOutput
}

async function getContent(url: string): Promise<Content> {
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

const projectsUrl =
	'https://raw.githubusercontent.com/jldec/jldec.me/c14da87a6340e7e45fe9943b8f4d4c15340de9b4/content/index.md'
const projectsKey = '/projects'

app.get('/tree', async (c) => {
	let cachedTree = await c.env.page_cache.get('TREE')
	if (cachedTree !== null) {
		return c.json(JSON.parse(cachedTree))
	} else return c.notFound()
})

const treeUrl = 'https://api.github.com/repos/jldec/presskit/git/trees/HEAD?recursive=TRUE'

app.post('/tree', async (c) => {
	let resp = await fetch(treeUrl, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${c.env.GH_PAT}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'presskit-worker'
		}
	})
	if (resp.ok) {
		await c.env.page_cache.put('TREE', JSON.stringify(await resp.json()))
		return c.text('OK')
	} else {
		c.status(resp.status as StatusCode)
		return c.text(resp.statusText)
	}
})

app.get('/projects', async (c) => {
	let content: Content
	const cachedContent = await c.env.page_cache.get(projectsKey)
	if (cachedContent !== null) {
		content = JSON.parse(cachedContent) as Content
		console.log('used cached content', content)
	} else {
		content = await getContent(`${projectsUrl}`)
		console.log('fetched content from file', content)
		c.executionCtx.waitUntil(summarizeAndCache(c.env, content))
	}
	c.status(content.statusCode)
	return c.render(
		'<h2>Summary</h2>' + (content.summary?.summary ?? ' No summary yet.') + '<hr>' + content.html
	)
})

async function summarizeAndCache(env: Bindings, content: Content) {
	content.summary = await env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: content.html,
		max_length: 50
	})
	// console.log('summarized content', JSON.stringify(content,null,2))
	return env.page_cache.put(projectsKey, JSON.stringify(content))
}

// Translate request path into file URL, including .md extension
// https://hono.dev/docs/api/routing#including-slashes
app.get('/:path{.+$}', async (c) => {
	const { path } = c.req.param()
	const content = await getContent(`${fileUrlPrefix}/${path}.md`)
	c.status(content.statusCode)
	return c.render(content.html)
})

export default app
