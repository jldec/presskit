// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
// https://hono.dev/docs/middleware/builtin/jsx-renderer
// jsxRenderer is required for <doctype html>

import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { componentMap } from './component-map'
import { PageData, DirData, Frontmatter, Context } from '../types'
import { Chat } from './chat'
import { Debug as Dbg } from './debug'

declare module 'hono' {
  interface ContextRenderer {
    (
      children: string | Promise<string>,
      props: {
        page?: PageData
        site?: Frontmatter
        dirEntry?: DirData
        status?: number
      }
    ): Response
  }
}

export function renderJsx() {
  return jsxRenderer(({ children, page, site, dirEntry }) => {
    const c: Context = useRequestContext()
    const path = page?.path
    const siteurl = site?.siteurl
    const url = (siteurl ?? '') + (path ?? '/')
    const splashimage = page?.attrs.splash?.image ?? page?.attrs.splashimage
    const image = page?.attrs.image ?? splashimage
    const siteimage = siteurl && image ? '' + new URL(image, url) : ''
    const title = page?.attrs.title ?? site?.title
    const description = page?.attrs.description ?? title ?? path ?? 'Homepage'
    const twitter = site?.twitter
    const favicon = site?.favicon
    const user =
      c.req.header('cf-access-authenticated-user-email') || c.env.DEBUG_USER || 'anonymous'
    return (
      <html lang="en" class="dark bg-white dark:bg-gray-900">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          {favicon ? <link rel="icon" href={favicon} /> : null}
          {title ? (
            <>
              <title>{title}</title>
              <meta property="og:title" content={title} />
            </>
          ) : null}
          {siteurl ? (
            <>
              <link rel="canonical" href={url} />
              <meta property="og:url" content={url} />
            </>
          ) : null}
          {siteimage ? (
            <>
              <meta property="og:image" content={siteimage} />
              <meta name="twitter:card" content="summary_large_image" />
            </>
          ) : null}
          {twitter ? (
            <>
              <meta name="twitter:site" content={twitter} />
              <meta name="twitter:creator" content={twitter} />
            </>
          ) : null}
          <link href="/css/styles.css" rel="stylesheet" />
          <script src="/js/htmx.min.js" defer></script>
          <script src="/js/image-enlarge.js" defer></script>
          <script src="/js/partychat.js" type="module" defer></script>
        </head>
        <body class="bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none">
          <div class="flex flex-col md:flex-row min-h-screen">
            {user !== 'anonymous' ? (
              <div class="p-3 max-w-[80ch] bg-orange-100">
                <Chat />
              </div>
            ) : null}
            <div class="p-3 max-w-[81ch] min-w-[35ch] overflow-hidden md:mx-auto mb-8 marker:text-orange-500">
              {(componentMap[page?.attrs.layout as string] ?? componentMap['DefaultLayout'])({
                children,
                page,
                site,
                dirEntry
              })}
              <Dbg page={page} />
            </div>
          </div>
        </body>
      </html>
    )
  })
}
