import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'
import { type DirPageData } from '../types'

export const BlogListLayout: FC = ({ children, page }) => {
	return (
		<>
			{raw(page?.html ?? '')}
			<ul>
				{page?.dir?.map((dirPage: DirPageData) => (
					<li>
						<a href={dirPage.path}>{dirPage.attrs?.title ?? dirPage.path}</a>
					</li>
				))}
			</ul>
		</>
	)
}
