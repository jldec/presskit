import type { Content, Context, StatusCode } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'

// memoize to speed up homeContent().attrs for Nav
let homeContent: Content | null = null

function fileUrlPrefix(c: Context) {
	if (c.env.ENVIRONMENT === 'dev') {
		return `${new URL(c.req.url).origin}/content`
	}
	// TODO: use env.CONTENT_URL
	return 'https://raw.githubusercontent.com/jldec/presskit/main/public/content'
}

function filePath(path: string, c: Context): string {
	if (path.endsWith('/')) {
		path += 'index'
	}
	return `${fileUrlPrefix(c)}${path}.md`
}

async function getTextFile(path: string, c: Context): Promise<string> {
	const response = await fetch(filePath(path, c))
	if (!response.ok) throw new Error(`${response.status} error fetching ${path}`)
	return await response.text()
}

export async function getContent(path: string, c: Context): Promise<Content | null> {
	try {
		if (c.req.header('Cache-Control') !== 'no-cache') {
			if (path === '/' && c.env.ENVIRONMENT !== 'dev' && homeContent) return homeContent

			const cachedContent = await c.env.PAGE_CACHE.get(path)
			if (cachedContent !== null) return JSON.parse(cachedContent) as Content
		}
		const text = await getTextFile(path, c)
		const parsedFrontmatter = parseFrontmatter(text)
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
