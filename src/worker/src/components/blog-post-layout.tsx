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
      <p class="text-gray-400 flex">
        <span class="flex-grow">{longdate}</span>
        {dirEntry?.nextPath ? (
        <a
          class="text-gray-400 hover:text-current no-underline px-4"
          href={dirEntry.nextPath}
          title={dirEntry.nextTitle || dirEntry.nextPath}
        >
          {' >> '}
        </a>
      ) : (
        ''
      )}

      </p>
      {raw(page.html)}
    </>
  )
}
