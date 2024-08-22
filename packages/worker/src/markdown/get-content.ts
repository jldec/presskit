import type { Content, Context, StatusCode } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'

const fileUrlPrefix = 'https://raw.githubusercontent.com/jldec/presskit/main/content'

// memoize to speed up homeContent().attrs for Nav
let homeContent: Content | null = null

function filePath(path: string): string {
	if (path.endsWith('/')) {
		path += 'index'
	}
	return `${fileUrlPrefix}${path}.md`
}

export async function getContent(path: string, c: Context): Promise<Content | null> {
	try {
		if (path === '/' && homeContent) return homeContent

		const cachedContent = await c.env.PAGE_CACHE.get(path)
		if (cachedContent !== null) return JSON.parse(cachedContent) as Content

		const response = await fetch(filePath(path))
		if (!response.ok) throw new Error(`${response.status} error fetching ${path}`)
		const parsedFrontmatter = parseFrontmatter(await response.text())
		const content = {
			attrs: parsedFrontmatter.attrs,
			md: parsedFrontmatter.body,
			html: parseMarkdown(parsedFrontmatter.body, { hashPrefix: c.env.IMAGE_KEY })
		}
		c.executionCtx.waitUntil(c.env.PAGE_CACHE.put(path, JSON.stringify(content)))
		if (path === '/') {
			homeContent = content
		}
		return content
	} catch (error) {
		console.error(error)
		return null
	}
}
