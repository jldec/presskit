import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'

export const Debug: FC = ({ page }) => {
	const c = useRequestContext()
	if ((c.env.ENVIRONMENT === 'dev' || c.env.ENVIRONMENT !== 'dev') && page)
		return (
			<details>
				<summary class="subtle">debug</summary>
				<pre>{JSON.stringify(page, null, 2)}</pre>
			</details>
		)
	return null
}
