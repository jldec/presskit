import type { Env, WaitUntil } from './types'

export async function getStatic(
  path: string,
  env: Env,
  waitUntil: WaitUntil,
  noCache: boolean = false
): Promise<Response | null> {
  if (!noCache) {
    const { value, metadata } = await env.STATIC_CACHE.getWithMetadata(path, {
      type: 'stream',
      // https://developers.cloudflare.com/kv/api/read-key-value-pairs/#cachettl-parameter
      cacheTtl: 86400
    })
    if (value !== null) return new Response(value, { headers: (metadata as any)?.headers })
  }
  const resp = await fetch(`${env.SOURCE_PREFIX}${path}`)

  if (!resp.ok || !resp.body) return null

  const [body, body2] = resp.body.tee()
  const headers = copyHeaders(resp.headers)
  headers['cache-control'] = 'public, max-age=86400'
  waitUntil(env.STATIC_CACHE.put(path, body2, { metadata: { headers } }))
  console.log('getStatic', path)
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
