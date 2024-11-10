import { FC, PropsWithChildren } from 'hono/jsx'
import { DefaultLayout } from './default-layout'
import { AdminLayout } from './admin-layout'
import { BlogListLayout } from './blog-list-layout'
import { BlogPostLayout } from './blog-post-layout'
import { PrivateLayout } from './private-layout'

export const componentMap: Record<string, FC<PropsWithChildren<any>>> = {
  DefaultLayout,
  AdminLayout,
  BlogListLayout,
  BlogPostLayout,
  private: PrivateLayout
}
