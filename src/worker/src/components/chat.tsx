import { type FC } from 'hono/jsx'
import { MessageSquare } from './icons'

export const Chat: FC = () => {
  return (
    <>
      <nav class="flex md:mb-2">
        <a
          class="ml-auto mr-[6px] md:mr-0"
          role="button"
          onclick="document.getElementById('chat-root').classList.toggle('hidden')"
        >
          <MessageSquare class="h-5 hover:text-orange-500 transition-colors duration-200 ease-in-out" />
        </a>
      </nav>
      <div id="chat-root" class="hidden"></div>
    </>
  )
}
