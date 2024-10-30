import { Env, WaitUntil, DirData, Navlink } from '../types'
import { getMarkdown } from './get-markdown'
import { getManifest } from '../manifest'

let dirsMemo: null | Record<string, string[]> = null
let pagePathsMemo: null | Record<string, boolean> = null

export function zapDirCache() {
  dirsMemo = null
  pagePathsMemo = null
}

// fetch DirData for [children] under a dirpath
// returns undefined for non-dirpaths
// never called with noCache
// NOTE: this may trigger recursively because is runs getMarkdown for children
export async function getDirData(
  dirPath: string,
  env: Env,
  waitUntil: WaitUntil,
  sortBy?: string
): Promise<DirData[] | undefined> {
  const dirs = dirsMemo || (await getDirs(env, waitUntil))
  const dir = dirs[dirPath]
  if (!dir) return undefined

  // TODO: throttle and detect cycles
  const dirPromises = dir?.map(async (pageName): Promise<DirData> => {
    const pagePath = dirPath + (dirPath === '/' ? '' : '/') + pageName
    const dirPage = await getMarkdown(pagePath, env, waitUntil)
    return { path: pagePath, attrs: dirPage?.attrs }
  })
  const dirData = await Promise.all(dirPromises || [])
  if (sortBy) {
    dirData.sort(sortFn(sortBy)).reverse()
  }
  // sort before populating next/prev
  for (let i = 0; i < dirData.length; i++) {
    dirData[i].next = i < dirData.length - 1 ? linkify(dirData[i + 1]) : linkify(dirData[0])
    dirData[i].prev = i > 0 ? linkify(dirData[i - 1]) : linkify(dirData[dirData.length - 1])
  }
  return dirData
}

function linkify(d: DirData): Navlink {
  return {
    href: d.path,
    text: d.attrs?.title ?? ''
  }
}

function sortFn(sortBy: string) {
  return function (a: DirData, b: DirData) {
    const v1 = (a.attrs && a.attrs[sortBy]) ?? ''
    const v2 = (b.attrs && b.attrs[sortBy]) ?? ''
    const result = v1 === v2 ? 0 : v1 > v2 ? 1 : -1
    // console.log('sortFn', a.path, b.path, v1, v2, result)
    return result
  }
}

export async function getPagePaths(env: Env, waitUntil: WaitUntil) {
  if (pagePathsMemo) return pagePathsMemo
  const dirs = await getDirs(env, waitUntil)
  const pagePaths: Record<string, boolean> = { '/': true }
  for (const dirpath of Object.keys(dirs)) {
    pagePaths[dirpath] = true
    for (const page of dirs[dirpath]) {
      pagePaths[`${dirpath === '/' ? '' : dirpath}/${page}`] = true
    }
  }
  pagePathsMemo = pagePaths
  // console.log('getPagePaths')
  return pagePaths
}

// Fetch dirs = hash of dirpaths -> [children]
// Populate dirs hash for *.md - all other paths are ignored.
// e.g. path/foo.md becomes path -> foo
//      path/dir/index.md becomes path -> dir
// TODO: fix path sep to support windows, use path functions instead of regexp
// TODO: handle dirs called <foo>.md
export async function getDirs(env: Env, waitUntil: WaitUntil) {
  let dirs: Record<string, string[]> = {}

  if (dirsMemo) return dirsMemo

  const manifest = await getManifest(env, waitUntil)
  if (manifest.length) {
    manifest.forEach((path) => {
      let match = path.match(/^(\/.*\/|\/)([^\/]+)\.md$/i)
      if (match) {
        if (match[2].toLowerCase() === 'index') {
          // capture dir even when index.md is the only file in the dir
          const dirpath = match[1] === '/' ? match[1] : match[1].slice(0, -1)
          dirs[dirpath] ??= []
          match = match[1].match(/^(\/.*\/|\/)([^\/]+)\/$/)
        }
        if (match) {
          const dirpath = match[1] === '/' ? match[1] : match[1].slice(0, -1)
          dirs[dirpath] ??= []
          const page = match[2]
          dirs[dirpath].push(page)
        }
      }
    })

    dirsMemo = dirs
    pagePathsMemo = null // invalidate when dirs change
  }
  return dirs
}
