import { FC } from 'hono/jsx'
import { Frontmatter } from '../types'

export const Menu: FC<{ site: Frontmatter }> = ({ site }) => {
  return (
    <nav class="flex flex-wrap gap-4 mb-6">
      {site.navlinks?.map((link) => {
        return (
          <a class="" href={link.href}>
            {link.text}
          </a>
        )
      })}
    </nav>
  )
}
