import type { Page, Env, WaitUntil } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'
import { getDir } from './get-dirs'

// memoize to speed up homeContent().attrs for Nav
let homePage: Page | null = null

function fileUrlPrefix(env: Env) {
	if (env.ENVIRONMENT === 'dev') {
		return `${new URL(env.APP_URL).origin}/content`
	}
	return `https://raw.githubusercontent.com/${env.GH_REPO}/main/public/content`
}

function filePath(path: string, env: Env): string {
	if (path.endsWith('/')) {
		path += 'index'
	}
	return `${fileUrlPrefix(env)}${path}.md`
}

async function getTextFile(path: string, env: Env): Promise<string> {
	const response = await fetch(filePath(path, env))
	if (!response.ok) throw new Error(`${response.status} error fetching ${path}`)
	return await response.text()
}

export async function getMarkdown(
	path: string,
	env: Env,
	waitUntil: WaitUntil,
	noCache: boolean = false,
): Promise<Page | null> {
	try {
		if (!noCache) {
			if (path === '/' && env.ENVIRONMENT !== 'dev' && homePage) return homePage

			const cachedContent = await env.PAGE_CACHE.get(path)
			if (cachedContent !== null) return JSON.parse(cachedContent) as Page
		}
		const text = await getTextFile(path, env)
		const parsedFrontmatter = parseFrontmatter(text)
		const content = {
			path,
			attrs: parsedFrontmatter.attrs,
			md: parsedFrontmatter.body,
			html: parsedFrontmatter.attrs.error
				? errorHtml(parsedFrontmatter.attrs.error, filePath(path, env))
				: parseMarkdown(parsedFrontmatter.body, { hashPrefix: env.IMAGE_KEY }),
			dir: await getDir(path, env)
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
