import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'
import { Menu } from './menu'

export const ChatLayout: FC = ({ page, site }) => {
  return (
    <>
      <Menu site={site} />
      {raw(page.html)}
      <div id="chat-root"></div>
      <script src="/js/partychat.js" type="module"></script>
    </>
  )
}
