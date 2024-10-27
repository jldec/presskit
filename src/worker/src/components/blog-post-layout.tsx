import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export function formatDate(date: any) {
  if (typeof date === 'string') {
    date = new Date(date)
    // console.log('parsed date', date)
  }
  if (!date || !(date instanceof Date)) return ''
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long'
  }).format(date)
}

export const BlogPostLayout: FC = ({ children, page, dirEntry }) => {
  // console.log('BlogPostLayout', dirPage)
  const longdate = [formatDate(page.attrs?.date)].filter(Boolean).join(' - ')
  return (
    <>
      <p class="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <a href="/">Home</a> | <a href="/blog">Writings</a>
        {dirEntry?.nextPath ? (
          <>
            <span class="text-gray-400">{' >> '}</span>
            <a class="text-gray-400 hover:text-current" href={dirEntry.nextPath}>
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
