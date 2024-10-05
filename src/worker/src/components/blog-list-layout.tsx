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
          return (
            <li>
              <a class="navlink" href={dirPage.path}>{text}</a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
