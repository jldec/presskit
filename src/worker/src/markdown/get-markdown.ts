import type { PageData, Env, WaitUntil } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'
import { getDir, getDirs } from './get-dirs'

// memoize to speed up homeContent().attrs for Nav
let homePage: PageData | null = null

function fileUrlPrefix(env: Env) {
	if (env.ENVIRONMENT === 'dev') {
		return `${new URL(env.APP_URL).origin}/content`
	}
	return `https://raw.githubusercontent.com/${env.GH_REPO}/main/public/content`
}

async function filePath(path: string, env: Env, noCache: boolean): Promise<string> {
	let dirs = await getDirs(env, noCache)
	console.log('filePath', path, Object.keys(dirs ?? {}).length)
	if (path in dirs) {
		path += (path === '/' ? '' : '/') + 'index'
	}
	return `${fileUrlPrefix(env)}${path}.md`
}

async function getTextFile(path: string, env: Env, noCache: boolean): Promise<string> {
	const response = await fetch(await filePath(path, env, noCache))
	if (!response.ok) throw new Error(`${response.status} error fetching ${path}`)
	return await response.text()
}

export async function getMarkdown(
	path: string,
	env: Env,
	waitUntil: WaitUntil,
	noCache: boolean = false,
): Promise<PageData | null> {
	try {
		if (!noCache) {
			if (path === '/' && env.ENVIRONMENT !== 'dev' && homePage) return homePage

			const cachedContent = await env.PAGE_CACHE.get(path)
			if (cachedContent !== null) return JSON.parse(cachedContent) as PageData
		}
		const text = await getTextFile(path, env, noCache)
		const parsedFrontmatter = parseFrontmatter(text)
		const content = {
			path,
			attrs: parsedFrontmatter.attrs,
			md: parsedFrontmatter.body,
			html: parsedFrontmatter.attrs.error
				? errorHtml(parsedFrontmatter.attrs.error, await filePath(path, env, false))
				: parseMarkdown(parsedFrontmatter.body, { hashPrefix: env.IMAGE_KEY }),
			dir: await getDir(path, env, false)
		}
		waitUntil(env.PAGE_CACHE.put(path, JSON.stringify(content)))
		if (path === '/') {
			homePage = content
		}
		return content
	} catch (error) {
		console.error(error)
		return null
	}
}

export async function getRootConfig(env: Env, waitUntil: WaitUntil)  {
	return (await getMarkdown('/', env, waitUntil))?.attrs
}

// TODO link to editor
function errorHtml(error: unknown, path: string) {
	return `<pre>${escapeHtml(path)}\n${escapeHtml('' + error)}</pre>`
}

function escapeHtml(s: string) {
	return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
}
