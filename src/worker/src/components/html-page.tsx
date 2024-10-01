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
    const title = page?.attrs.title ?? site?.title
    const description = page?.attrs.description
    const image = siteurl && page?.attrs.splash?.image ? siteurl + page.attrs.splash.image : ''
    const twitter = site?.twitter

    return (
      <html lang="en" data-theme="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {siteurl ? (
            <>
              <link rel="canonical" href={siteurl} />
              <meta property="og:url" content={siteurl + (path ?? '/')} />
            </>
          ) : null}
          {title ? (
            <>
              <title>{title}</title>
              <meta property="og:title" content={title} />
            </>
          ) : null}
          {description ? (
            <>
              <meta property="og:description" content={description} />
            </>
          ) : null}
          {image ? (
            <>
              <meta property="og:image" content={image} />
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
          <script src="/js/htmx.min.js"></script>
        </head>
        <body>
          {(componentMap[page?.attrs.layout as string] ?? componentMap['DefaultLayout'])({
            children,
            page,
            dirPage: dirEntry
          })}
          <Dbg page={page} />
        </body>
      </html>
    )
  })
}
