import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const Admin: FC = () => (
	<>
		<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/echo" hx-target=".json">
			echo
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/manifest" hx-target=".json">
			manifest
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/env" hx-target=".json">
			env
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/cache" hx-target=".json">
			cache
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-delete="/api/cache" hx-target=".json">
			delete cache
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-get="/api/images" hx-target=".json">
			images
		</button>
		<button class="btn btn-secondary mb-2 mr-2" hx-delete="/api/images" hx-target=".json">
			delete images
		</button>
		<pre class="json"></pre>
	</>
)
