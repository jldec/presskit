import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const AdminLayout: FC = ({ page }) => (
	<>
		{raw(page?.html ?? '')}
		<button hx-get="/api/echo" hx-target=".json">
			echo
		</button>{' '}
		<button hx-get="/api/manifest" hx-target=".json">
			manifest
		</button>{' '}
		<button hx-get="/api/env" hx-target=".json">
			env
		</button>{' '}
		<button hx-get="/api/cache" hx-target=".json">
			cache
		</button>{' '}
		<button hx-delete="/api/cache" hx-target=".json">
			delete cache
		</button>{' '}
		<button hx-get="/api/images" hx-target=".json">
			images
		</button>{' '}
		<button hx-delete="/api/images" hx-target=".json">
			delete images
		</button>
		<pre class="json"></pre>
	</>
)
