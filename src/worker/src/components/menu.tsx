import { FC } from 'hono/jsx'
import { Frontmatter } from '../types'
import { icons } from './icons'

export const Menu: FC<{ site?: Frontmatter }> = ({ site }) => {
  if (!site) return null
  return (
    <nav class="flex flex-wrap gap-1 mb-6">
      {site?.navlinks?.map((link) => {
        return (
          <a class="px-1" href={link.href}>
            {link.icon
              ? (icons[link.icon] ?? icons['default'])({ name: link.icon, class: 'h-5 hover:text-blue-500' })
              : link.text}
          </a>
        )
      })}
      <span class="flex-grow"></span>
      {site?.sociallinks?.map((link) => {
        return (
          <a class="px-1" href={link.href}>
            {link.icon
              ? (icons[link.icon] ?? icons['default'])({ name: link.icon, class: 'h-5 hover:text-blue-500' })
              : link.text}
          </a>
        )
      })}
    </nav>
  )
}
