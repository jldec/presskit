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
  if (env.ENVIRONMENT === 'dev') {
    const resp = await fetch(env.SOURCE_TREE_URL)
    if (resp.ok) {
      manifest = (await resp.json()) as string[]
    }
    console.log('getManifest from local dev', resp.status)
  } else {
    // https://docs.github.com/en/rest/git/trees (in prod)
    const resp = await fetch(env.SOURCE_TREE_URL + '?recursive=1', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GH_PAT}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'presskit-worker'
      }
    })
    if (resp.ok) {
      const rawtree = ((await resp.json()) as { tree: { path: string }[] })?.tree
      for (const { path } of rawtree) {
        manifest.push('/' + path)
      }
    }
    console.log('getManifest from github', resp.status)
  }

  if (manifest.length) {
    manifestMemo = manifest
    waitUntil(env.PAGE_CACHE.put(manifestCacheKey, JSON.stringify(manifest)))
    // invalidate caches when manifest is reloaded
    zapDirCache()
    zapRedirectCache()
  }
  return manifest
}
