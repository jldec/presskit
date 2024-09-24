import { type FC } from 'hono/jsx'
import { DefaultLayout } from './default-layout'
import { AdminLayout } from './admin-layout'
import { ChatLayout } from './chat-layout'
import { BlogListLayout } from './blog-list-layout'
import { BlogPostLayout } from './blog-post-layout'

export const componentMap: Record<string, FC> = {
	DefaultLayout,
	AdminLayout,
	ChatLayout,
	BlogListLayout,
	BlogPostLayout
}
