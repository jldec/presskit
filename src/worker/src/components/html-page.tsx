// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
// https://hono.dev/docs/middleware/builtin/jsx-renderer
// jsxRenderer is required for <doctype html>

import { jsxRenderer } from 'hono/jsx-renderer'
import { componentMap } from './component-map'
import { PageData, DirPageData } from '../types'
import { Debug as Dbg } from './debug'

declare module 'hono' {
	interface ContextRenderer {
		(
			children: string | Promise<string>,
			props: { page?: PageData; dirPage?: DirPageData; status?: number }
		): Response
	}
}

export function renderJsx() {
	return jsxRenderer(({ children, page, dirPage }) => {
		return (
			<html lang="en" data-theme="dark">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{page?.attrs.title ?? 'Presskit'}</title>
					<link href="/css/styles.css" rel="stylesheet" />
					<script src="/js/htmx.min.js"></script>
				</head>
				<body>
					{(componentMap[page?.attrs.layout as string] ?? componentMap['DefaultLayout'])({
						children,
						page,
						dirPage
					})}
					<Dbg page={page} />
				</body>
			</html>
		)
	})
}
