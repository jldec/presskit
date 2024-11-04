import { raw } from 'hono/html'
import { PropsWithChildren } from 'hono/jsx'
import { Frontmatter, PageData } from '../types'
import { Menu } from './menu'
import { Splash } from './splash'

export function PrivateLayout({
  children,
  page,
  site
}: PropsWithChildren<{ page: PageData; site: Frontmatter }>) {
  return (
    <div class="private">
      <Menu site={site} />
      <Splash page={page} />
      {raw(page?.html ?? '')}
      {children}
    </div>
  )
}
