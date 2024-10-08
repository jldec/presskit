import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const AdminLayout: FC = ({ page }) => (
  <>
    {raw(page?.html ?? '')}
    <button hx-get="/api/manifest" hx-target=".json">
      manifest
    </button>{' '}
    <button hx-get="/api/redirects" hx-target=".json">
      redirects
    </button>{' '}
    <button hx-get="/api/dirs" hx-target=".json">
      dirs
    </button>{' '}
    <button hx-get="/api/pagepaths" hx-target=".json">
      pages
    </button>{' '}
    <button hx-get="/api/echo" hx-target=".json">
      echo
    </button>{' '}
    <button hx-get="/api/env" hx-target=".json">
      env
    </button>{' '}
    <button hx-get="/api/cache" hx-target=".json">
      page cache
    </button>{' '}
    <button hx-delete="/api/cache" hx-target=".json">
      delete page cache
    </button>{' '}
    <button hx-get="/api/static-cache" hx-target=".json">
      static cache
    </button>{' '}
    <button hx-delete="/api/static-cache" hx-target=".json">
      delete static cache
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
