import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'
import { Splash } from './splash'
import { Menu } from './menu'

export function formatDate(date: any) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  if (!date || !(date instanceof Date)) return ''
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long'
  }).format(date)
}

export const BlogPostLayout: FC = ({ page, site, dirEntry }) => {
  const longdate = [formatDate(page.attrs?.date)].filter(Boolean).join(' - ')
  return (
    <>
      <Menu site={site} />
      <Splash page={page} />
      <p class="text-right gap-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {dirEntry?.nextPath ? (
          <>
            <span class="text-gray-400">{' >> '}</span>
            <a class="text-gray-300 hover:text-current" href={dirEntry.nextPath}>
              {dirEntry.nextTitle || dirEntry.nextPath}
            </a>
          </>
        ) : (
          ''
        )}
      </p>
      <p class="text-gray-400">{longdate}</p>
      {raw(page.html)}
    </>
  )
}
