import { raw } from 'hono/html'
import { PropsWithChildren } from 'hono/jsx'
import { Frontmatter, PageData } from '../types'
import { Menu } from './menu'

export function DefaultLayout({ children, page, site }: PropsWithChildren<{ page: PageData, site: Frontmatter }>) {
  return (
    <>
      <Menu site={site} />
      {raw(page.html)}
      {children}
    </>
  )
}
