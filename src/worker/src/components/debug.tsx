import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'

export const Debug: FC = ({ page }) => {
  const c = useRequestContext()
  if (c.env.ENVIRONMENT === 'dev' && page)
    return (
      <details class="mt-4 cursor-pointer">
        <summary class="text-black/30 dark:text-white/40">debug</summary>
        <pre>{JSON.stringify(page, null, 2)}</pre>
      </details>
    )
  return null
}
