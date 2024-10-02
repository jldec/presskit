import type { Context } from './types'

export async function getStatic(
  path: string,
  c: Context,
  noCache: boolean = false
): Promise<Response | null> {
  if (!noCache) {
    const { value, metadata } = await c.env.STATIC_CACHE.getWithMetadata(path, 'stream')
    if (value !== null) return new Response(value, { headers: (metadata as any)?.headers })
  }
  const resp = await fetch(`${c.env.SOURCE_PREFIX}${path}`)

  if (!resp.ok || !resp.body) return null

  const [body, body2] = resp.body.tee()
  c.executionCtx.waitUntil(
    c.env.STATIC_CACHE.put(path, body2, { metadata: { headers: copyHeaders(resp.headers) } })
  )
  console.log('getStatic', path)
  return new Response(body, resp)
}

function copyHeaders(ogHeaders: Headers) {
  const copyList = ['Content-Type', 'Content-Language', 'Content-Encoding', 'Content-Disposition']
  const headers: Record<string, string> = {}
  copyList.forEach((header) => {
    if (ogHeaders.has(header)) {
      headers[header] = ogHeaders.get(header)!
    }
  })
  return headers
}
