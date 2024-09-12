// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
// https://hono.dev/docs/middleware/builtin/jsx-renderer
// jsxRenderer is required for <doctype html>

import { jsxRenderer } from 'hono/jsx-renderer'
import { Navbar } from './navbar'
import { componentMap } from './component-map'
import { Page } from '../types'

declare module 'hono' {
	interface ContextRenderer {
		(children: string | Promise<string>, props: { page?: Page; status?: number }): Response
	}
}

export function renderJsx() {
	return jsxRenderer(({ children, page }) => {
		return (
			<html lang="en" data-theme="dark">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{page?.attrs.title ?? 'Presskit'}</title>
					<link href="/css/styles.css" rel="stylesheet" />
					<script src="/js/htmx.js"></script>
				</head>
				<body>
					<Navbar>{componentMap[page?.attrs.layout ?? 'DefaultLayout']({ children, page })}</Navbar>
					{page ? (
						<details class="p-4">
							<pre>{JSON.stringify(page, null, 2)}</pre>
						</details>
					) : (
						<></>
					)}
				</body>
			</html>
		)
	})
}