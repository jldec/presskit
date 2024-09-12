import { type FC } from 'hono/jsx'
import { Page } from '../types'

export const Hero: FC<{ page: Page }> = ({ page }) => {
	const hero = page.attrs.hero
	return (
		<section class="p-4 sm:p-8 flex sm:gap-8 flex-wrap-reverse justify-center items-center bg-slate-100 dark:bg-slate-700">
			<div class="max-w-lg">
				<h1 class="text-5xl sm:text-6xl my-4 text-slate-800 dark:text-slate-100">
					{hero?.name || 'hero.name'}
				</h1>
				<h2 class="text-3xl sm:text-4xl my-4 text-slate-600 dark:text-slate-300">
					{hero?.text || 'hero.text'}
				</h2>
				<div class="text-xl my-4 text-slate-600 dark:text-slate-300">{hero?.tagline || ''}</div>
				<div class="flex flex-row flex-wrap items-end gap-4 pb-4">
					{(hero?.actionlinks || []).map((link) => (
						<a href={link.href}>{link.text}</a>
					))}
				</div>
			</div>
		</section>
	)
}
