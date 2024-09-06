import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const DefaultLayout: FC = ({ children, page }) => {
	return (
		<div class="p-4">
			<div class="prose mx-auto ">
				{children}
				{raw(page?.html ?? '')}
			</div>
		</div>
	)
}
