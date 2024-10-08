import { Hono, WaitUntil } from './types'
import { getDirs, getPagePaths, zapDirCache } from './markdown/get-dirs'
import { getManifest, zapManifestCache } from './manifest'
import { getRedirects, zapRedirectCache } from './redirects'

// instance to be mounted at /api
export const api = new Hono()

// pretty-print json
function fjson(o: any) {
  return new Response(JSON.stringify(o, null, 2), {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

// echo request
// useful for debugging
api.get('/echo', async (c) => {
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

api.get('/env', async (c) => {
  //⚠️ don't return c.env secrets
  return fjson(c.env.ENVIRONMENT)
})

// page cache
api.get('/cache', async (c) => {
  const list = await c.env.PAGE_CACHE.list()
  const keys = list.keys.map((o) => o.name)
  return fjson(list)
})

api.delete('/cache', async (c) => {
  const list = await c.env.PAGE_CACHE.list()
  const keys = list.keys.map((o) => o.name)
  const deleted = await Promise.all(keys.map((key) => c.env.PAGE_CACHE.delete(key)))
  zapDirCache()
  return fjson({ pageCache: deleted, caches: 'zapped' })
})

// page cache
api.get('/static-cache', async (c) => {
  const list = await c.env.STATIC_CACHE.list()
  const keys = list.keys.map((o) => o.name)
  return fjson(list)
})

api.delete('/static-cache', async (c) => {
  const list = await c.env.STATIC_CACHE.list()
  const keys = list.keys.map((o) => o.name)
  const deleted = await Promise.all(keys.map((key) => c.env.STATIC_CACHE.delete(key)))
  zapManifestCache()
  zapRedirectCache()
  return fjson({ pageCache: deleted, caches: 'zapped' })
})

// images in R2
api.get('/images', async (c) => {
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

api.delete('/images', async (c) => {
  let keys = (await c.env.IMAGES.list()).objects.map((object) => object.key)
  await c.env.IMAGES.delete(keys)
  return fjson(keys)
})

api.get('/manifest', async (c) => {
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)
  return fjson(await getManifest(c.env, waitUntil))
})

api.get('/redirects', async (c) => {
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)
  return fjson(await getRedirects(c.env, waitUntil))
})

api.get('/dirs', async (c) => {
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)
  return fjson(await getDirs(c.env, waitUntil))
})

api.get('/pagepaths', async (c) => {
  const waitUntil: WaitUntil = (promise) => c.executionCtx.waitUntil(promise)
  return fjson(await getPagePaths(c.env, waitUntil))
})
