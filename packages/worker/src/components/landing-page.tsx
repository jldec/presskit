import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const LandingPage: FC = ({ children, page }) => {
	return (
		<div class="p-4">
			<div class="prose mx-auto ">
				<h1>Landing Page</h1>
				{children}
				{raw(page?.html ?? '')}
			</div>
			<details>
			<pre>{JSON.stringify(page, null, 2)}</pre>
			</details>
		</div>
	)
}
