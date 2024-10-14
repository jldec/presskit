import type { PageData, Env, WaitUntil } from '../types'
import { parseFrontmatter } from './parse-frontmatter'
import { parseMarkdown } from './parse-markdown'
import { getDirData, getDirs } from './get-dirs'

// memoize to speed up homeContent().attrs for Nav
let homePage: PageData | null = null

async function filePath(path: string, env: Env, waitUntil: WaitUntil): Promise<string> {
  let dirs = await getDirs(env, waitUntil)
  if (path in dirs) {
    path += (path === '/' ? '' : '/') + 'index'
  }
  return `${path}.md`
}

async function getTextFile(path: string, env: Env, waitUntil: WaitUntil): Promise<string> {
  const filepath = await filePath(path, env, waitUntil)
  let resp: Response
  let source = 'github'
  if (env.ENVIRONMENT === 'dev') {
    source = 'localhost:8765'
    resp = await fetch(`http://localhost:8765${filepath}`)
  } else {
    // https://docs.github.com/en/rest/repos/contents
    resp = await fetch(
      `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${env.GH_PATH}${filepath}?ref=${env.GH_BRANCH}`,
      {
        headers: {
          Accept: 'application/vnd.github.raw+json',
          Authorization: `Bearer ${env.GH_PAT}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'presskit-worker'
        }
      }
    )
  }
  if (!resp.ok) throw new Error(`${resp.status} error fetching ${path}`)
  console.log('getMarkdown', source, resp.status)
  return await resp.text()
}

export async function getMarkdown(
  path: string,
  env: Env,
  waitUntil: WaitUntil,
  noCache: boolean = false
): Promise<PageData | null> {
  const isHome = path === '/'

  if (!noCache) {
    if (isHome && homePage) return homePage
    const cachedContent = await env.PAGE_CACHE.get(path)
    if (cachedContent !== null) return JSON.parse(cachedContent) as PageData
  }

  const text = await getTextFile(path, env, waitUntil)
  const parsedFrontmatter = parseFrontmatter(text)
  const dirData = await getDirData(path, env, waitUntil, parsedFrontmatter.attrs.sortby)
  const content = {
    path,
    attrs: parsedFrontmatter.attrs,
    md: parsedFrontmatter.body,
    html: parsedFrontmatter.attrs.error
      ? errorHtml(parsedFrontmatter.attrs.error, await filePath(path, env, waitUntil))
      : parseMarkdown(parsedFrontmatter.body, {
          hashPrefix: env.IMAGE_KEY
        }),
    dir: dirData
  }
  waitUntil(env.PAGE_CACHE.put(path, JSON.stringify(content)))
  if (isHome) {
    homePage = content
  }
  return content
}

function errorHtml(error: unknown, path: string) {
  return `<pre>${escapeHtml(path)}\n${escapeHtml('' + error)}</pre>`
}

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
}
