import type { PageData, DirData, Env, WaitUntil } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'
import { getDirData, getDirs } from './get-dirs'

// memoize to speed up homeContent().attrs for Nav
let homePage: PageData | null = null

async function filePath(
  path: string,
  env: Env,
  waitUntil: WaitUntil,
  noCache: boolean
): Promise<string> {
  let dirs = await getDirs(env, waitUntil, noCache)
  if (path in dirs) {
    path += (path === '/' ? '' : '/') + 'index'
  }
  return `${env.SOURCE_PREFIX}${path}.md`
}

async function getTextFile(
  path: string,
  env: Env,
  waitUntil: WaitUntil,
  noCache: boolean
): Promise<string> {
  const url = await filePath(path, env, waitUntil, noCache)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} error fetching ${path}`)
  console.log('getMarkdown', url, response.status)
  return await response.text()
}

export async function getMarkdown(
  path: string,
  env: Env,
  waitUntil: WaitUntil,
  noCache: boolean = false
): Promise<PageData | null> {
  const isHome = path === '/'
  try {
    if (!noCache) {
      if (isHome && env.ENVIRONMENT !== 'dev' && homePage) return homePage

      const cachedContent = await env.PAGE_CACHE.get(path)
      if (cachedContent !== null) return JSON.parse(cachedContent) as PageData
    }
    const text = await getTextFile(path, env, waitUntil, isHome && noCache)
    const parsedFrontmatter = parseFrontmatter(text)
    const dirData = await getDirData(path, env, waitUntil, parsedFrontmatter.attrs.sortby)
    const content = {
      path,
      attrs: parsedFrontmatter.attrs,
      md: parsedFrontmatter.body,
      html: parsedFrontmatter.attrs.error
        ? errorHtml(parsedFrontmatter.attrs.error, await filePath(path, env, waitUntil, false))
        : parseMarkdown(parsedFrontmatter.body, {
            hashPrefix: env.IMAGE_KEY,
            sourcePrefix: env.SOURCE_PREFIX
          }),
      dir: dirData
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

export async function getRootConfig(env: Env, waitUntil: WaitUntil) {
  return (await getMarkdown('/', env, waitUntil))?.attrs
}

// TODO link to editor
function errorHtml(error: unknown, path: string) {
  return `<pre>${escapeHtml(path)}\n${escapeHtml('' + error)}</pre>`
}

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
}
