import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { type FC } from 'hono/jsx'
import { serveStatic } from 'hono/cloudflare-workers'
import { StatusCode } from 'hono/utils/http-status'
import { raw } from 'hono/html'
import { parseFrontmatter } from './frontmatter'
import { parseMarkdown } from './markdown'

// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
declare module 'hono' {
	interface ContextRenderer {
		(content: string | Promise<string>, props: { title?: string; htmlContent?: string }): Response
	}
}

// @ts-expect-error
// TODO - figure out if this is required.
// followed: https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
// see also: https://github.com/honojs/hono/issues/1127
import manifest from '__STATIC_CONTENT_MANIFEST'

type Bindings = {
	page_cache: KVNamespace
	AI: any
	GH_PAT: string
}

const app = new Hono<{ Bindings: Bindings }>()

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/presskit/main/content'
const indexFile = 'index.md'

type Content = {
	statusCode: StatusCode
	attrs: any
	html: string
	summary?: AiSummarizationOutput
}

let homeContent: Content | null = null

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

const NavItems: FC = async () => {
	if (homeContent === null) await getHomeContent()
	return (
		<>
			{homeContent?.attrs.nav?.map((item: any) => (
				<li>
					<a class="link px-2" href={item.link}>
						{item.text ?? item.link}
					</a>
				</li>
			))}
			<li>
				<a class="link px-2 font-black" href="/test-htmx">
					Admin
				</a>
			</li>
		</>
	)
}

const Navbar: FC = async (props) => {
	return (
		<div class="drawer">
			<input id="presskit-nav" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex flex-col">
				<div class="navbar bg-base-200 w-full">
					<div class="flex-none lg:hidden">
						<label for="presskit-nav" aria-label="open sidebar" class="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="inline-block h-6 w-6 stroke-current"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>
					<div class="mx-2 flex-1 px-2">
						<a href="/" class="link link-hover font-black">
							Presskit
						</a>
					</div>
					<div class="hidden flex-none lg:block">
						<ul class="menu menu-horizontal">
							<NavItems />
						</ul>
					</div>
				</div>
				{props.children}
			</div>
			<div class="drawer-side">
				<label for="presskit-nav" aria-label="close sidebar" class="drawer-overlay"></label>
				<ul class="menu bg-base-200 min-h-full min-w-fit p-4">
					<li class="-mx-2">
						<a href="/" class="link link-hover font-black w-40 text-lg">
							Presskit
						</a>
					</li>
					<NavItems />
				</ul>
			</div>
		</div>
	)
}

// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
app.use(
	jsxRenderer(({ children, title, htmlContent }) => {
		return (
			<html lang="en" data-theme="emerald">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{title ?? 'Presskit'}</title>
					<link href="/css/styles.css" rel="stylesheet" />
					<script src="/js/htmx.js"></script>
				</head>
				<body>
					<Navbar>
						<div class="p-4">
							<div class="prose mx-auto ">
								{children}
								{raw(htmlContent ?? '')}
							</div>
						</div>
					</Navbar>
				</body>
			</html>
		)
	})
)

async function getHomeContent() {
	homeContent = await getContent(`${fileUrlPrefix}/${indexFile}`)
	console.log(JSON.stringify(homeContent.attrs))
}

app.get('/', async (c) => {
	if (homeContent === null) await getHomeContent()
	return c.render('', { htmlContent: homeContent?.html, title: homeContent?.attrs?.title })
})

// test api
app.get('/api/echo', async (c) => {
	const req = c.req.raw
	const echo = {
		method: req.method,
		url: req.url,
		headers: Object.fromEntries(req.headers.entries()),
		cf: req.cf,
		body: await req.text(),
		booger: 1
	}
	if (c.req.query('pretty')) {
		return c.text(JSON.stringify(echo, null, 2))
	}
	return c.json(echo)
})

// test api
app.get('/api/manifest', async (c) => {
	const o = JSON.parse(manifest)
	if (c.req.query('pretty')) {
		return c.text(JSON.stringify(o, null, 2))
	}
	return c.json(o)
})

app.get('/test-htmx', async (c) => {
	return c.render(
		<>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/echo?pretty=1" hx-target=".textarea-secondary">
				Echo
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/manifest?pretty=1" hx-target=".textarea-secondary">
				Manifest
			</button>
			<textarea class="textarea textarea-secondary w-full" rows={20} placeholder="watch this space"></textarea>
		</>,
		{}
	)
})

app.get('/test-function-call', async (c) => {
	const response = await c.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
		messages: [
			{
				role: 'user',
				content: 'what is the weather in london?'
			}
		],
		tools: [
			{
				name: 'getWeather',
				description: 'Return the weather for a latitude and longitude',
				parameters: {
					type: 'object',
					properties: {
						latitude: {
							type: 'string',
							description: 'The latitude for the given location'
						},
						longitude: {
							type: 'string',
							description: 'The longitude for the given location'
						}
					},
					required: ['latitude', 'longitude']
				}
			}
		]
	})
	return c.text(JSON.stringify(response,null,2))
})

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

// middleware fetches markdown content, fall through if not found
app.use(async (c, next) => {
	let path = c.req.path // includes leading /
	let content: Content
	let cached = false
	const cachedContent = await c.env.page_cache.get(path)
	if (cachedContent !== null) {
		content = JSON.parse(cachedContent) as Content
		cached = true
	} else {
		content = await getContent(`${fileUrlPrefix}${path}.md`)
	}
	if (content.statusCode === 200) {
		if (!cached) {
			c.executionCtx.waitUntil(summarizeAndCache(c.env, path, content))
		}
		c.status(content.statusCode)
		return c.render(
			<>
				<h2>AI Summary</h2>
				{content.summary?.summary ?? ' No summary yet.'}
				<hr />
			</>,
			{ htmlContent: content.html, title: content.attrs?.title }
		)
	}
	// else fall through
	await next()
})

// serve static from the root
app.get(serveStatic({ root: './', manifest }))

async function summarizeAndCache(env: Bindings, key: string, content: Content) {
	content.summary = await env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: content.html,
		max_length: 50
	})
	// console.log('summarized content', JSON.stringify(content,null,2))
	await env.page_cache.put(key, JSON.stringify(content))
}

app.notFound((c) => {
	return c.render(
		<>
			<h2>Sorry, can't find that.</h2>
			<p>{c.req.url}.</p>
		</>,
		{ title: 'Presskit, Page not found' }
	)
})

export default app
