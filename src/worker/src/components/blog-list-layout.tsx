import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'
import { type DirData } from '../types'

export const BlogListLayout: FC = ({ children, page }) => {
  return (
    <>
      {raw(page?.html ?? '')}
      <ul>
        {page?.dir?.map((dirPage: DirData) => {
          const text = dirPage.attrs?.title ?? dirPage.path
          let date = dirPage.attrs?.date ?? ''
          return (
            <li>
              <a
                class="flex gap-4 text-transparent hover:text-gray-300 no-underline border-b-[1.5px] border-b-transparent hover:border-b-black"
                href={dirPage.path}
              >
                <span class="flex-grow text-black">{text}</span>
                <span class="">
                  {date}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
