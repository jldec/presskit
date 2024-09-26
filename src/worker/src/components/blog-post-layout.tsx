import { raw } from "hono/html"
import { type FC } from "hono/jsx"

export function formatDate(date: any) {
  if (typeof date === "string") {
    date = new Date(date)
    console.log("parsed date", date)
  }
  if (!date || !(date instanceof Date)) return ""
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(date)
}

export const BlogPostLayout: FC = ({ children, page, dirPage }) => {
  // console.log('BlogPostLayout', dirPage)
  const credits = [formatDate(page.attrs?.date)].filter(Boolean).join(" - ")
  return (
    <>
      <a href="/">Home</a> | <a href="/blog">Writings</a>
      {dirPage?.nextPath ? (
        <>
          {" >> "}
          <a href={dirPage.nextPath}>{dirPage.nextTitle || dirPage.nextPath}</a>
        </>
      ) : (
        ""
      )}
      <p class="subtle push-down">{credits}</p>
      {raw(page?.html ?? "")}
      {children}
    </>
  )
}
