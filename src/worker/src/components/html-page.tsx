// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
// https://hono.dev/docs/middleware/builtin/jsx-renderer
// jsxRenderer is required for <doctype html>

import { jsxRenderer } from 'hono/jsx-renderer'
import { componentMap } from './component-map'
import { PageData, DirData, Frontmatter, Splash } from '../types'
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
        </head>
        <body class="bg-white dark:bg-gray-900">
          <div class="prose dark:prose-invert font-mono max-w-[80ch] overflow-hidden mx-3 md:mx-auto mb-8 marker:text-orange-500">
            {(componentMap[page?.attrs.layout as string] ?? componentMap['DefaultLayout'])({
              children,
              page,
              site,
              dirEntry
            })}
            <Dbg page={page} />
          </div>
        </body>
      </html>
    )
  })
}
