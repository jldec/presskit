import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const DefaultLayout: FC = ({ children, page }) => {
	return (
		<>
			{raw(page?.html ?? '')}
			{children}
		</>
	)
}
