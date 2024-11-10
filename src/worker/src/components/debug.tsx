import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'
import { type Context } from '../types'

export const Debug: FC = ({ page }) => {
  const c: Context = useRequestContext()
  const user = c.req.header('cf-access-authenticated-user-email') || c.env.DEBUG_USER || 'unauthenticated'
  if (page && c.env.DEBUG)
    return (
      <details class="mt-4 cursor-pointer">
        <summary class="text-black/30 dark:text-white/40">debug</summary>
        <h4>user: {user}</h4>
        <pre>{JSON.stringify(page, null, 2)}</pre>
      </details>
    )
  return null
}
