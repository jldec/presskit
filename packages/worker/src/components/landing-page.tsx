import { type FC } from 'hono/jsx'
import { type Page } from '../types'
import { Hero } from './hero'

export const LandingPage: FC<{ children: JSX.Element; page: Page }> = ({ children, page }) => {
	return (
		<>
			<Hero page={page} />
			{children}
		</>
	)
}
