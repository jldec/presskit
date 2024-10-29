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
      <p class="flex text-gray-400 hover:text-current">
        <span class="flex-grow">{longdate}</span>
        {dirEntry?.nextPath ? (
        <a
          class="px-4"
          href={dirEntry.nextPath}
          title={`Next: ${dirEntry.nextTitle || dirEntry.nextPath}`}
        >
          {'>>'}
        </a>
      ) : (
        ''
      )}

      </p>
      {raw(page.html)}
    </>
  )
}
