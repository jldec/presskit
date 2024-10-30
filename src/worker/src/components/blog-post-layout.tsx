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
      <p class="flex">
        <span class="flex-grow">{longdate}</span>
        <a class="px-2 text-gray-400 hover:text-current" href={'.'}>
          list
        </a>
        {dirEntry?.prev ? (
          <a
            class="px-2 text-gray-400 hover:text-current"
            href={dirEntry.prev.href}
            title={`Prev: ${dirEntry.prev.text}`}
          >
            {'<<'}
          </a>
        ) : (
          ''
        )}
        {dirEntry?.next ? (
          <a
            class="px-2 text-gray-400 hover:text-current"
            href={dirEntry.next.href}
            title={`Next: ${dirEntry.next.text}`}
          >
            {'>>'}
          </a>
        ) : (
          ''
        )}
      </p>
      {raw(page?.html ?? '')}
    </>
  )
}
