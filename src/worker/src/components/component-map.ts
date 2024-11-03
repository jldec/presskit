import { FC, PropsWithChildren } from 'hono/jsx'
import { DefaultLayout } from './default-layout'
import { AdminLayout } from './admin-layout'
import { ChatLayout } from './chat-layout'
import { BlogListLayout } from './blog-list-layout'
import { BlogPostLayout } from './blog-post-layout'
import { PrivateLayout } from './private-layout'

export const componentMap: Record<string, FC<PropsWithChildren<any>>> = {
  DefaultLayout,
  AdminLayout,
  ChatLayout,
  BlogListLayout,
  BlogPostLayout,
  private: PrivateLayout
}
