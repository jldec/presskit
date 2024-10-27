import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const ResumeLayout: FC = ({ children, page }) => {
  return (
    <div class="resume">
      {raw(page.html)}
      {children}
    </div>
  )
}
