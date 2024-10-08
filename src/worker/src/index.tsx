import { Hono, WaitUntil } from './types'
import { routePartykitRequest } from 'partyserver'
import { getPagePaths } from './markdown/get-dirs'
import { getManifest } from './manifest'
import { getMarkdown } from './markdown/get-markdown'
import { getImage } from './images'
import { renderJsx } from './components/html-page'
import { api } from './api'
import { getStatic } from './static'
import { getRedirects } from './redirects'
import { RedirectStatusCode } from 'hono/utils/http-status'

export { Party } from './party'

const app = new Hono()
app.use(renderJsx())

app.route('/api', api)

// serve rewritten markdown image links (deprecated)
app.get('/img/:image{.+$}', async (c) => {
  const image = c.req.param('image')
  return await getImage(image, c)
})

// serve rendered markdown pages and same-origin static content from manifest
// fall through if not found
app.use(async (c, next) => {
  const noCache = c.req.header('Cache-Control') === 'no-cache'
  const path = c.req.path // includes leading /
  const isHome = path === '/'
  if (c.req.method !== 'GET' || path.startsWith('/parties')) {
    return await next()
  }
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)

  // This should be the only place we force reloading the tree from source
  let manifest = await getManifest(c.env, waitUntil, noCache && isHome)
  if (manifest.includes(path)) {
    const resp = await getStatic(path, c.env, waitUntil, noCache)
    if (resp) return resp
  }

  let pagePaths = await getPagePaths(c.env, waitUntil)
  if (path in pagePaths) {
    const page = await getMarkdown(path, c.env, waitUntil, noCache)
    if (page) {
      const site = (await getMarkdown('/', c.env, waitUntil))?.attrs
      const dirEntry = path.startsWith('/blog/')
        ? (await getMarkdown('/blog', c.env, waitUntil))?.dir?.find((p) => p.path === path)
        : undefined
      return c.render('', { page, site, dirEntry })
    }
  }

  let redirects = await getRedirects(c.env, waitUntil)
  if (path in redirects) {
    return c.redirect(redirects[path].redirect, redirects[path].status)
  }

  await next()
})

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

app.onError((err, c) => {
  c.status(404)
  return c.render(
    <>
      <h1>Oops 😬</h1>
      <pre>{err.stack ?? err.message}</pre>
      <p>
        <a href="/">Home</a>
      </p>
    </>,
    {}
  )
})

export default app
