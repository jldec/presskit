import { jsxRenderer } from 'hono/jsx-renderer'
import { Navbar } from './components/navbar'
import { componentMap } from './components/component-map'

// https://hono.dev/docs/middleware/builtin/jsx-renderer#extending-contextrenderer
declare module 'hono' {
	interface ContextRenderer {
		(
			content: string | Promise<string>,
			props: {
				layout?: string
				title?: string
				htmlContent?: string
			}
		): Response
	}
}

// https://hono.dev/docs/api/context#render-setrenderer
// https://hono.dev/docs/helpers/html#insert-snippets-into-jsx
// https://hono.dev/docs/middleware/builtin/jsx-renderer
// jsxRenderer is required for <doctype html>
export function renderJsx() {
	return jsxRenderer(({ children, layout, title, htmlContent }) => {
		return (
			<html lang="en" data-theme="emerald">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{title ?? 'Presskit'}</title>
					<link href="/css/styles.css" rel="stylesheet" />
					<script src="/js/htmx.js"></script>
				</head>
				<body>
					<Navbar>
						{componentMap[layout ?? 'DefaultLayout']({ children, htmlContent })}
					</Navbar>
				</body>
			</html>
		)
	})
}
