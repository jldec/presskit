import { Env, WaitUntil, DirPageData } from '../types'
// @ts-expect-error
import manifest from '__STATIC_CONTENT_MANIFEST'
import { getMarkdown } from './get-markdown'

// TODO - make this configurable
const treeUrl = 'https://api.github.com/repos/jldec/presskit/git/trees/HEAD?recursive=1'
const treeCacheKey = 'tree:jldec/presskit'

let dirsMemo: null | Record<string, string[]> = null
let pagePathsMemo: null | Record<string, boolean> = null

export function zapDirCache() {
	dirsMemo = null
	pagePathsMemo = null
}

// fetch DirPageData for [children] under a dirpath
// returns undefined for non-dirpaths
// NOTE: this may trigger recursively because is runs getMarkdown for children
export async function getDirPageData(
	dirPath: string,
	env: Env,
	waitUntil: WaitUntil,
	noCache: boolean = false,
	sortBy?: string
): Promise<DirPageData[] | undefined> {
	const dirs = dirsMemo || (await getDirs(env, waitUntil, noCache))
	const dirPages = dirs[dirPath]
	if (!dirPages) return undefined

	// TODO: throttle and detect cycles
	const dirPagesPromises = dirPages?.map(async (pageName): Promise<DirPageData> => {
		const pagePath = dirPath + (dirPath === '/' ? '' : '/') + pageName
		const dirPage = await getMarkdown(pagePath, env, waitUntil, noCache)
		return { path: pagePath, attrs: dirPage?.attrs }
	})
	const dirPageData = await Promise.all(dirPagesPromises || [])
	if (sortBy) {
		dirPageData.sort(sortFn(sortBy)).reverse()
	}
	// sort before populating nextPath/nextTitle
	for (let i = 0; i < dirPageData.length; i++) {
		if (i < dirPageData.length - 1) {
			dirPageData[i].nextPath = dirPageData[i + 1].path
			dirPageData[i].nextTitle = dirPageData[i + 1].attrs?.title
		}
	}
	return dirPageData
}

function sortFn(sortBy: string) {
	return function (a: DirPageData, b: DirPageData) {
		const v1 = a.attrs && a.attrs[sortBy]
		const v2 = b.attrs && b.attrs[sortBy]
		// @ts-expect-error
		const result = v1 === v2 ? 0 : v1 > v2 ? 1 : -1
		return result
	}
}

export async function getPagePaths(env: Env, waitUntil: WaitUntil, noCache: boolean = false) {
	if (!noCache) {
		if (pagePathsMemo) return pagePathsMemo
	}
	const dirs = await getDirs(env, waitUntil, noCache)
	const pagePaths: Record<string, boolean> = { '/': true }
	for (const dirpath of Object.keys(dirs)) {
		pagePaths[dirpath] = true
		for (const page of dirs[dirpath]) {
			pagePaths[`${dirpath === '/' ? '' : dirpath}/${page}`] = true
		}
	}
	pagePathsMemo = pagePaths
	console.log('getPagePaths')
	return pagePaths
}

// Fetch dirs = hash of dirpaths -> [children]
export async function getDirs(env: Env, waitUntil: WaitUntil, noCache: boolean = false) {
	let dirs: Record<string, string[]> = {}

	if (!noCache) {
		if (dirsMemo) return dirsMemo

		const cachedContent = await env.PAGE_CACHE.get(treeCacheKey)
		if (cachedContent !== null) {
			dirsMemo = JSON.parse(cachedContent) as Record<string, string[]>
			return dirsMemo
		}
	}

	// local dev uses content directory in worker site public assets manifest
	if (env.ENVIRONMENT === 'dev') {
		const resp = await fetch('http://localhost:8765/')
		if (resp.ok) {
			const manifest = await resp.json() as string[]
			manifest.forEach(extractDirEntry)
		}
	} else {
		// https://docs.github.com/en/rest/git/trees (in prod)
		const resp = await fetch(treeUrl, {
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
				extractDirEntry(path.slice('src/dev/content'.length)) // strip path prefix
			}
		}
	}

	dirsMemo = dirs
	waitUntil(env.PAGE_CACHE.put(treeCacheKey, JSON.stringify(dirs)))
	console.log('getDirs')
	return dirs

	// Populate dirs hash for *.md - all other paths are ignored.
	// e.g. path/foo.md becomes path -> foo
	//      path/dir/index.md becomes path -> dir
	// TODO: fix path sep to support windows, use path functions instead of regexp
	// TODO: handle dirs called <foo>.md
	function extractDirEntry(path: string) {
		let match = path.match(/^(\/.*\/|\/)([^\/]+)\.md$/i)
		if (match) {
			if (match[2].toLowerCase() === 'index') {
				match = match[1].match(/^(\/.*\/|\/)([^\/]+)\/$/)
			}
			if (match) {
				const dirpath = match[1] === '/' ? match[1] : match[1].slice(0, -1)
				const page = match[2]
				dirs[dirpath] ??= []
				dirs[dirpath].push(page)
			}
		}
	}
}
