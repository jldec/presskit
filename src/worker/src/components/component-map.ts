import { type FC } from 'hono/jsx'
import { DefaultLayout } from './default-layout'
import { AdminLayout } from './admin-layout'
import { ChatLayout } from './chat-layout'

export const componentMap: Record<string, FC> = {
	DefaultLayout: DefaultLayout,
	AdminLayout: AdminLayout,
	ChatLayout: ChatLayout
}