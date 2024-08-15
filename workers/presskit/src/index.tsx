import { Hono, Context } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { type FC } from 'hono/jsx'
import { serveStatic } from 'hono/cloudflare-workers'
import { StatusCode } from 'hono/utils/http-status'
import { raw } from 'hono/html'
import { parseFrontmatter } from './markdown/parse-frontmatter'
import { parseMarkdown } from './markdown/parse-markdown'
import { extname } from '@std/path'
import { hash } from './markdown/hash'
// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
declare module 'hono' {
	interface ContextRenderer {
		(content: string | Promise<string>, props: { title?: string; htmlContent?: string }): Response
	}
}

// @ts-expect-error
// TODO - figure out how to avoid ts error.
// followed: https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
// see also: https://github.com/honojs/hono/issues/1127
import manifest from '__STATIC_CONTENT_MANIFEST'

type Bindings = {
	PAGE_CACHE: KVNamespace
	IMAGES: R2Bucket
	AI: any
	GH_PAT: string
	IMAGE_KEY: string
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

async function getContent(
	url: string,
	c: Context<{
		Bindings: Bindings
	}>
): Promise<Content> {
	try {
		const response = await fetch(url)
		const parsedContent = parseFrontmatter(await response.text())

		return {
			statusCode: response.status as StatusCode,
			attrs: parsedContent.attrs,
			html: parseMarkdown(parsedContent.body, { hashPrefix: c.env.IMAGE_KEY })
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
	const c = useRequestContext()
	if (homeContent === null) await getHomeContent(c)
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
				<a class="link px-2 font-black" href="/admin">
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

async function getHomeContent(c: Context<{ Bindings: Bindings }>) {
	homeContent = await getContent(`${fileUrlPrefix}/${indexFile}`, c)
	console.log(JSON.stringify(homeContent.attrs))
}

app.get('/', async (c) => {
	if (homeContent === null) await getHomeContent(c)
	return c.render('', { htmlContent: homeContent?.html, title: homeContent?.attrs?.title })
})

app.get('/admin', async (c) => {
	return c.render(
		<>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/echo" hx-target=".json">
				echo
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/manifest" hx-target=".json">
				manifest
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/cache" hx-target=".json">
				cache
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-delete="/api/cache" hx-target=".json">
				delete cache
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/images" hx-target=".json">
				images
			</button>
			<button class="btn btn-secondary mb-2 mr-2" hx-delete="/api/images" hx-target=".json">
				delete images
			</button>
			<pre class="json"></pre>
		</>,
		{}
	)
})

// Formatted c.json()
function fjson(o: any) {
	return new Response(JSON.stringify(o, null, 2), {
		headers: { 'Content-Type': 'application/json; charset=UTF-8' }
	})
}

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
	return fjson(echo)
})

app.get('/api/manifest', async (c) => {
	const o = JSON.parse(manifest)
	return fjson(o)
})

app.get('/api/cache', async (c) => {
	const list = await c.env.PAGE_CACHE.list()
	const keys = list.keys.map((o) => o.name)
	return fjson(list)
})

app.delete('/api/cache', async (c) => {
	const list = await c.env.PAGE_CACHE.list()
	const keys = list.keys.map((o) => o.name)
	const deleted = await Promise.all(keys.map((key) => c.env.PAGE_CACHE.delete(key)))
	return fjson(deleted)
})

app.get('/api/images', async (c) => {
	const list = await c.env.IMAGES.list({ include: ['httpMetadata', 'customMetadata'] })
	const r2Objects = list.objects
	const data = r2Objects.map((r2Object) => ({
		key: r2Object.key,
		size: r2Object.size,
		...r2Object.customMetadata,
		...r2Object.httpMetadata,
		etag: r2Object.etag
	}))
	return fjson(data)
})

app.delete('/api/images', async (c) => {
	let keys = (await c.env.IMAGES.list()).objects.map((object) => object.key)
	await c.env.IMAGES.delete(keys)
	return fjson(keys)
})

app.get('/tree', async (c) => {
	let cachedTree = await c.env.PAGE_CACHE.get('TREE')
	if (cachedTree !== null) {
		return fjson(JSON.parse(cachedTree))
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
		await c.env.PAGE_CACHE.put('TREE', JSON.stringify(await resp.json()))
		return c.text('OK')
	} else {
		c.status(resp.status as StatusCode)
		return c.text(resp.statusText)
	}
})

// serve images from r2 bucket
// if not found, serve from og src, and upload to r2 in background
// protects against unwanted sideloading by signing hashes
// TODO: make signed hashes more seccure
// TODO: use CF cache, and add cache control headers
// TODO: multi-part and ranges
app.get('/img/:image{.+$}', async (c) => {
	const image = c.req.param('image')
	let object = await c.env.IMAGES.get(image)
	if (object !== null) {
		const headers = new Headers()
		object.writeHttpMetadata(headers)
		headers.set('etag', object.httpEtag)
		return c.body(object.body, { headers })
	}

	const og = c.req.query('og')
	if (!og) return c.notFound()

	const hashPrefix = c.env.IMAGE_KEY
	const check = hash(hashPrefix + og)
	if (check !== image) {
		console.log('image hash mismatch', check, image)
		return c.notFound()
	}
	const resp = await fetch(og)
	if (!resp.ok || !resp.body) return c.notFound()

	const [body, body2] = resp.body.tee()
	c.executionCtx.waitUntil(
		c.env.IMAGES.put(image, body2, {
			customMetadata: { og },
			httpMetadata: storeHeaders(resp.headers)
		})
	)
	return c.body(body, { headers: resp.headers })
})

function storeHeaders(ogHeaders: Headers) {
	// https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#http-metadata
	// don't store the original cache-control headers (for now)
	const copyList = ['Content-Type', 'Content-Language', 'Content-Encoding', 'Content-Disposition']
	const headers = new Headers()
	copyList.forEach((header) => {
		if (ogHeaders.has(header)) {
			headers.set(header, ogHeaders.get(header) as string)
		}
	})
	return headers
}

// middleware fetches markdown content, fall through if not found
// only serves extensionless routes
app.use(async (c, next) => {
	let path = c.req.path // includes leading /
	if (extname(path) !== '') return await next()
	let content: Content
	let cached = false
	const cachedContent = await c.env.PAGE_CACHE.get(path)
	if (cachedContent !== null) {
		content = JSON.parse(cachedContent) as Content
		cached = true
	} else {
		content = await getContent(`${fileUrlPrefix}${path}.md`, c)
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
	console.log('summarized content', JSON.stringify(content, null, 2))
	await env.PAGE_CACHE.put(key, JSON.stringify(content))
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
