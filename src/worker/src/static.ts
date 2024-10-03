import type { Context } from './types'

export async function getStatic(
  path: string,
  c: Context,
  noCache: boolean = false
): Promise<Response | null> {
  if (!noCache) {
    const { value, metadata } = await c.env.STATIC_CACHE.getWithMetadata(path, {
      type: 'stream',
      // https://developers.cloudflare.com/kv/api/read-key-value-pairs/#cachettl-parameter
      cacheTtl: 86400
    })
    if (value !== null) return new Response(value, { headers: (metadata as any)?.headers })
  }
  const resp = await fetch(`${c.env.SOURCE_PREFIX}${path}`)

  if (!resp.ok || !resp.body) return null

  const [body, body2] = resp.body.tee()
  const headers = copyHeaders(resp.headers)
  c.executionCtx.waitUntil(c.env.STATIC_CACHE.put(path, body2, { metadata: { headers } }))
  console.log('getStatic', path)
  headers['cache-control'] = 'public, max-age=600'
  return new Response(body, { headers })
}

function copyHeaders(ogHeaders: Headers) {
  const copyList = ['content-type', 'content-language', 'content-encoding', 'content-disposition', 'etag']
  const headers: Record<string, string> = {}
  copyList.forEach((header) => {
    if (ogHeaders.has(header)) {
      headers[header] = ogHeaders.get(header)!
    }
  })
  return headers
}
