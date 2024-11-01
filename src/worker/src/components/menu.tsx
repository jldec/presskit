import { FC } from 'hono/jsx'
import { Frontmatter, Navlink } from '../types'
import { icons } from './icons'

export const Menu: FC<{ site?: Frontmatter }> = ({ site }) => {
  if (!site) return null
  return (
    <nav class="flex flex-wrap my-4">
      {site?.navlinks?.map(menuLink)}
      <span class="flex-grow"></span>
      {site?.sociallinks?.map(menuLink)}
    </nav>
  )
}

function menuLink(link: Navlink) {
  return (
    <a class="px-[6px]" href={link.href} aria-label={link.text}>
      {link.icon
        ? (icons[link.icon] ?? icons['default'])({
            name: link.icon,
            class: 'h-5 hover:text-orange-500 transition-colors duration-200 ease-in-out'
          })
        : link.text}
    </a>
  )
}
