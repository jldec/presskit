import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'

export const Debug: FC = ({ page }) => {
  const c = useRequestContext()
  const user = c.req.header('cf-access-authenticated-user-email')
  if (page /* && c.env.ENVIRONMENT === 'dev'*/)
    return (
      <details class="mt-4 cursor-pointer">
        <summary class="text-black/30 dark:text-white/40">debug</summary>
        <h4>user: {user}</h4>
        <pre>{JSON.stringify(page, null, 2)}</pre>
      </details>
    )
  return null
}
