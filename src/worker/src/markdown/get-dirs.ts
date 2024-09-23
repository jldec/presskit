import { Env, WaitUntil, DirPageData } from '../types'
// @ts-expect-error
import manifest from '__STATIC_CONTENT_MANIFEST'
import { getMarkdown } from './get-markdown'

// TODO - make this configurable
const treeUrl = 'https://api.github.com/repos/jldec/presskit/git/trees/HEAD?recursive=1'
const treeKey = 'tree:jldec/presskit'

let dirsMemo: null | Record<string, string[]> = null
let pagePathsMemo: null | Record<string, boolean> = null

// fetch DirPageData for [children] under a dirpath
// returns undefined for non-dirpaths
export async function getDirPageData(
	dirPath: string,
	env: Env,
	waitUntil: WaitUntil,
	noCache: boolean = false,
	sortBy?: string
) {
	const dirs = dirsMemo || (await getDirs(env, waitUntil, noCache))
	const dirPages = dirs[dirPath]
	if (!dirPages) return undefined

	// TODO: throttle and detect cycles
	const dirPagesPromises = dirPages?.map(async (pageName) => {
		const pagePath = dirPath + (dirPath === '/' ? '' : '/') + pageName
		const dirPage = await getMarkdown(pagePath, env, waitUntil, noCache)
		return { path: pagePath, attrs: dirPage?.attrs }
	})
	const dirPageData = await Promise.all(dirPagesPromises || [])
	if (sortBy) {
		dirPageData.sort(sortFn(sortBy)).reverse()
	}
	console.log(
		'getDir',
		dirPath,
		dirPages?.length || 0,
		dirPageData.map((dpd) => dpd.path)
	)
	return dirPageData
}

function sortFn(sortBy: string) {
	return function (a: DirPageData, b: DirPageData) {
		const v1 = a.attrs && a.attrs[sortBy]
		const v2 = b.attrs && b.attrs[sortBy]
		// @ts-expect-error
		const result = v1 === v2 ? 0 : v1 > v2 ? 1 : -1
		// console.log('sort', v1, v2, result)
		return result
	}
}

export async function getPagePaths(env: Env, waitUntil: WaitUntil, noCache: boolean = false) {
	if (pagePathsMemo) return pagePathsMemo
	// Assume getDirs will also populate pagePathsMemo
	await getDirs(env, waitUntil, noCache)
	return pagePathsMemo
}

// Fetch dirs = hash of dirpaths -> [children]
// also collects pagesPaths which includes non-dirs
// TODO: use this info to validate all requests in page handler
// TODO: cache dir trees in KV
export async function getDirs(env: Env, waitUntil: WaitUntil, noCache: boolean = false) {
	console.log('getDirs dirsMemo:', !!dirsMemo, 'noCache:', noCache)
	let dirs: Record<string, string[]> = {}
	let pagePaths: Record<string, boolean> = { '/': true }

	if (!noCache) {
		if (dirsMemo) return dirsMemo

		const cachedContent = await env.PAGE_CACHE.get(treeKey)
		if (cachedContent !== null) {
			dirsMemo = JSON.parse(cachedContent) as Record<string, string[]>
			pagePathsMemo = extractPagePaths(dirsMemo)
			console.log('getDirs from KV', Object.keys(dirsMemo).length)
			return dirsMemo
		}
	}

	// local dev uses content directory in worker site public assets manifest
	if (env.ENVIRONMENT === 'dev') {
		Object.keys(JSON.parse(manifest)).forEach((path) => {
			extractDirEntry(path.slice('content'.length)) // strip path prefix
		})
		console.log('getDirs from manifest', Object.keys(dirs).length)
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
			rawtree.forEach(({ path }) => {
				extractDirEntry(path.slice('public/content'.length)) // strip path prefix
			})
			console.log('getDirs from github', Object.keys(dirs).length)
		}
	}

	dirsMemo = dirs
	pagePathsMemo = pagePaths
	waitUntil(env.PAGE_CACHE.put(treeKey, JSON.stringify(dirs)))
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
				pagePaths[`${dirpath === '/' ? '' : dirpath}/${page}`] = true
			}
		}
	}

	function extractPagePaths(dirs: Record<string, string[]>) {
		Object.keys(dirs).map((dirpath) => {
			pagePaths[dirpath] = true
			dirs[dirpath].forEach((page) => {
				pagePaths[`${dirpath === '/' ? '' : dirpath}/${page}`] = true
			})
		})
		return pagePaths
	}
}
