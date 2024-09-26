import { raw } from "hono/html"
import { type FC } from "hono/jsx"
import { type DirPageData } from "../types"

export const BlogListLayout: FC = ({ children, page }) => {
  return (
    <>
      {raw(page?.html ?? "")}
      <ul>
        {page?.dir?.map((dirPage: DirPageData) => {
          const text = dirPage.attrs?.title ?? dirPage.path
          // let date = dirPage.attrs?.date
          // if (typeof date === "string") {
          //   date = new Date(date)
          // } // reparse JSON dates
          // const dateStr =
          //   date instanceof Date
          //     ? ` ${date.getFullYear()}.${("0" + (date.getMonth() + 1)).slice(-2)}.${("0" + date.getDate()).slice(-2)}`
          //     : ""
          return (
            <li>
              <a href={dirPage.path}>{text}</a>
              {/* <span class="subtle">{dateStr}</span> */}
            </li>
          )
        })}
      </ul>
    </>
  )
}
