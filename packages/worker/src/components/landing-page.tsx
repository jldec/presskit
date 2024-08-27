import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const LandingPage: FC = ({ children, htmlContent }) => {
	return (
		<div class="p-4">
			<div class="prose mx-auto ">
				<h1>Landing Page</h1>
				{children}
				{raw(htmlContent ?? '')}
			</div>
		</div>
	)
}
