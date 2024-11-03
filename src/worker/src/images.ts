import { type Context } from './types'
import { hash } from './markdown/hash'

// DEPRECATED - only used for cross-origin images like github uploads
// serves rewritten markdown image links from r2 bucket
// if nots found, serve from og src, and upload to r2 in background
// protects against unwanted sideloading by signing hashes
// TODO: make signed hashes more secure
// TODO: multi-part and ranges
export async function getImage(image: string, c: Context) {
  if (c.req.header('Cache-Control') !== 'no-cache') {
    let object = await c.env.IMAGES.get(image)
    if (object !== null) {
      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)
      headers.set('cache-control', 'public, max-age=600')
      return c.body(object.body, { headers })
    }
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
  // console.log('fetch img', og, resp.status)
  if (!resp.ok || !resp.body) return c.notFound()

  const [body, body2] = resp.body.tee()
  c.executionCtx.waitUntil(
    c.env.IMAGES.put(image, body2, {
      customMetadata: { og, fetched: new Date().toISOString() },
      httpMetadata: storeHeaders(resp.headers)
    })
  )
  return c.body(body, { headers: resp.headers })
}

function storeHeaders(ogHeaders: Headers) {
  // https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#http-metadata
  // don't store the original cache-control headers
  const copyList = ['Content-Type', 'Content-Language', 'Content-Encoding', 'Content-Disposition']
  const headers = new Headers()
  copyList.forEach((header) => {
    if (ogHeaders.has(header)) {
      headers.set(header, ogHeaders.get(header) as string)
    }
  })
  return headers
}
