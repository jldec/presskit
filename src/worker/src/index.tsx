import { Hono, WaitUntil } from './types'
import { serveStatic } from 'hono/cloudflare-workers'
import { extname } from '@std/path'
import { routePartykitRequest } from 'partyserver'
import { getPagePaths } from './markdown/get-dirs'
import { getMarkdown } from './markdown/get-markdown'
import { getImage } from './images'
import { renderJsx } from './components/html-page'
import { api } from './api'

export { Party } from './party'
export { Page } from './page'

// @ts-expect-error
// TODO - fix this when cloudflare offers a better solution for workers static asssets.
// followed: https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
// see also: https://github.com/honojs/hono/issues/11273
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()
app.use(renderJsx())

app.route('/api', api)

// serve images
app.get('/img/:image{.+$}', async (c) => {
	const image = c.req.param('image')
	return await getImage(image, c)
})

// serve markdown content, fall through if not found
// only serves extensionless route including root '/'
app.use(async (c, next) => {
	const noCache = c.req.header('Cache-Control') === 'no-cache'
	const path = c.req.path // includes leading /
	if (extname(path) !== '' || path.startsWith('/parties') || path.startsWith('/content')) {
		return await next()
	}
	const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)

	let pagePaths = await getPagePaths(c.env, waitUntil, noCache)
	if (pagePaths && path in pagePaths) {
		const page = await getMarkdown(path, c.env, waitUntil)

		// const id: DurableObjectId = c.env.PAGES.idFromName(path)
		// const client = c.env.PAGES.get(id)
		// const page = await client.getPage(path, noCache)
		if (page) return c.render('', { page })
	}

	await next()
})

// serve static from the root
app.get(serveStatic({ root: './', manifest }))

// listen for websocket (partySocket) requests
app.use(async (c, next) => {
	if (c.req.path.startsWith('/parties')) {
		const party = await routePartykitRequest(c.req.raw, c.env)
		if (party) return party
	}
	await next()
})

app.notFound((c) => {
	c.status(404)
	return c.render(
		<>
			<h1>Sorry, can't find that.</h1>
			<p>{c.req.url}</p>
			<p>
				<a href="/">Home</a>
			</p>
		</>,
		{}
	)
})

export default app
