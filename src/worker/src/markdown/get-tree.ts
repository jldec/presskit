import type { Context } from '../types'
// @ts-expect-error
import manifest from '__STATIC_CONTENT_MANIFEST'

// TODO: fetch tree and use to validate markdown paths
const treeUrl = 'https://api.github.com/repos/jldec/presskit/git/trees/HEAD'

export async function getTree(path: string, c: Context) {
	if (c.req.header('Cache-Control') !== 'no-cache') {
		const cachedContent = await c.env.TREE_CACHE.get(path)
		if (cachedContent !== null) return JSON.parse(cachedContent)
	}
	let tree
	if (c.env.ENVIRONMENT === 'dev') {
		return JSON.parse(manifest)
	}
	let resp = await fetch(treeUrl, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${c.env.GH_PAT}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'presskit-worker'
		}
	})
	if (resp.ok) {
		tree = await resp.json()
		c.executionCtx.waitUntil(c.env.TREE_CACHE.put('TREE', JSON.stringify(tree)))
		return tree
	} else {
		return null
	}
}
