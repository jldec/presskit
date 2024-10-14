import { Env, WaitUntil } from './types'
import { zapDirCache } from './markdown/get-dirs'
import { zapRedirectCache } from './redirects'

const manifestCacheKey = 'manifest:jldec/presskit'

let manifestMemo: null | string[] = null

export function zapManifestCache() {
  manifestMemo = null
}

// Fetch array of rooted file paths from source
export async function getManifest(env: Env, waitUntil: WaitUntil, noCache: boolean = false) {
  let manifest: string[] = []

  if (!noCache) {
    if (manifestMemo) return manifestMemo

    const cachedContent = await env.PAGE_CACHE.get(manifestCacheKey)
    if (cachedContent !== null) {
      manifestMemo = JSON.parse(cachedContent) as string[]
      return manifestMemo
    }
  }

  // local dev uses content directory in worker site public assets manifest
  const source = env.SOURCE_TREE_URL
  if (source.startsWith('http://localhost:8765/')) {
    const resp = await fetch(source)
    if (resp.ok) {
      // TODO: validate json
      manifest = (await resp.json()) as string[]
    }
  } else if (source.startsWith('https://api.github.com/repos/')) {
    // https://docs.github.com/en/rest/git/trees
    const resp = await fetch(source, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GH_PAT}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'presskit-worker'
      }
    })
    if (resp.ok) {
      const rawtree = ((await resp.json()) as { tree: { path: string }[] })?.tree
      // TODO: validate json
      for (const { path } of rawtree) {
        manifest.push('/' + path)
      }
    }
  }

  if (manifest?.length) {
    manifestMemo = manifest
    waitUntil(env.PAGE_CACHE.put(manifestCacheKey, JSON.stringify(manifest)))
    // invalidate caches when manifest is reloaded
    zapDirCache()
    zapRedirectCache()
  } else {
    manifest = []
  }

  console.log('getManifest from', source, manifest?.length)
  return manifest
}
