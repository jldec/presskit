import { Hono, type StatusCode } from './types'
import { serveStatic } from 'hono/cloudflare-workers'
import { extname } from '@std/path'
import { routePartykitRequest } from 'partyserver'
import { getMarkdown } from './markdown/get-markdown'
import { getImage } from './images'
import { renderJsx } from './renderer'
import { Admin } from './components/admin'
import { api } from './api'
// PartyServer durable object
export { Chat } from './partyserver'

// @ts-expect-error
// TODO - fix this when cloudflare offers a better solution for workers static asssets.
// followed: https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files
// see also: https://github.com/honojs/hono/issues/11273
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()
app.use(renderJsx())

app.route('/api', api)

app.get('/admin', async (c) => {
	return c.render(<Admin />, {})
})

app.get('/chat', async (c) => {
	return c.render(
		<>
			<div id="chat-root"></div>
			<script src="/js/partychat.js" type="module"></script>
		</>,
		{}
	)
})

// serve images
app.get('/img/:image{.+$}', async (c) => {
	const image = c.req.param('image')
	return await getImage(image, c)
})

// serve markdown content, fall through if not found
// only serves extensionless route including root '/'
app.use(async (c, next) => {
	const path = c.req.path // includes leading /
	if (extname(path) !== '' || path.startsWith('/parties')) return await next()

	const page = await getMarkdown(path, c)
	if (page) return c.render('', { page })

	await next()
})

// serve static from the root
app.get(serveStatic({ root: './', manifest }))

// listen for websocket (partySocket) requests
app.use(async (c, next) => {
	const party = c.req.path.startsWith('/parties') && (await routePartykitRequest(c.req.raw, c.env))
	console.log('routePartykitRequest', c.req.url, party)
	return party || (await next())
})

app.notFound((c) => {
	return c.render(
		<>
			<h2>Sorry, can't find that.</h2>
			<p>{c.req.url}.</p>
		</>,
		{}
	)
})

export default app
