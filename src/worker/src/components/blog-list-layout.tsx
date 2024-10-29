import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'
import { type DirData } from '../types'
import { Menu } from './menu'
import { Splash } from './splash'

export const BlogListLayout: FC = ({ page, site }) => {
  return (
    <>
      <Menu site={site} />
      <Splash page={page} />
      {raw(page?.html ?? '')}
      <ul>
        {page?.dir?.map((dirPage: DirData) => {
          const text = dirPage.attrs?.title ?? dirPage.path
          let date = dirPage.attrs?.date ?? ''
          return (
            <li class="">
              <a
                class="group flex items-end gap-4 no-underline border-b-[1.5px] border-b-transparent hover:border-b-current"
                href={dirPage.path}
              >
                <span class="flex-grow">{text}</span>
                <span class="hidden md:block text-transparent group-hover:text-gray-400">{date}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
