import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const BlogPostLayout: FC = ({ children, page, dirPage }) => {
	// console.log('BlogPostLayout', dirPage)
	return (
		<>
			<a href="/">Home</a> | <a href="/blog">Blog</a>
			{dirPage?.nextPath ? (
				<>
					{' '}
					| <a href={dirPage.nextPath}>Next: {dirPage.nextTitle || dirPage.nextPath}</a>
				</>
			) : (
				''
			)}
			{raw(page?.html ?? '')}
			{children}
		</>
	)
}
