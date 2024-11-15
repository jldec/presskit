import { type FC } from 'hono/jsx'
import { MessageSquare } from './icons'
import { useRequestContext } from 'hono/jsx-renderer'
import { type Context } from '../types'

export const Chat: FC = () => {
  const c: Context = useRequestContext()
  return (
    <>
      <nav class="flex md:mb-2">
        <span id="chat-user" class="hidden font-semibold">{c.get('user')}</span>
        <a
          class="ml-auto mr-[6px] md:mr-0"
          role="button"
          onclick="document.getElementById('chat-root').classList.toggle('hidden');document.getElementById('chat-user').classList.toggle('hidden')"
        >
          <MessageSquare class="h-5 hover:text-orange-500 transition-colors duration-200 ease-in-out" />
        </a>
      </nav>
      <div id="chat-root" class="hidden"></div>
    </>
  )
}
