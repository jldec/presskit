import { Hono, WaitUntil } from './types'
import { extname } from '@std/path'
import { routePartykitRequest } from 'partyserver'
import { getPagePaths } from './markdown/get-dirs'
import { getMarkdown } from './markdown/get-markdown'
import { getImage } from './images'
import { renderJsx } from './components/html-page'
import { api } from './api'

export { Party } from './party'

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
  const isHome = path === '/'
  if (extname(path) !== '' || path.startsWith('/parties') || path.startsWith('/content')) {
    return await next()
  }
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)

  let pagePaths = await getPagePaths(c.env, waitUntil, noCache && isHome)
  if (pagePaths && path in pagePaths) {
    const page = await getMarkdown(path, c.env, waitUntil, noCache)

    // const id: DurableObjectId = c.env.PAGES.idFromName(path)
    // const client = c.env.PAGES.get(id)
    // const page = await client.getPage(path, noCache)
    if (page) {
      const dirPage = path.startsWith('/blog/')
        ? (await getMarkdown('/blog', c.env, waitUntil))?.dir?.find((p) => p.path === path)
        : undefined
      return c.render('', { page, dirPage })
    }
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

export default app
