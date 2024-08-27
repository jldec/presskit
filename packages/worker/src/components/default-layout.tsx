import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const DefaultLayout: FC = ({ children, htmlContent }) => {
	return (
		<div class="p-4">
			<div class="prose mx-auto ">
				{children}
				{raw(htmlContent ?? '')}
			</div>
		</div>
	)
}
