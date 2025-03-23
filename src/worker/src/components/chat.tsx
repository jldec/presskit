import { type FC } from 'hono/jsx'
import { MessageSquare } from './icons'

export const Chat: FC = () => {
  return (
    <>
      <nav class="flex gap-1 md:mb-2">
        <a
          class=""
          role="button"
          onclick={`
            const chatRoot = document.getElementById('chat-root');
            const chatHeading = document.getElementById('chat-heading');
            chatRoot.classList.toggle('hidden');
            chatHeading.classList.toggle('hidden');
            if (!chatRoot.classList.contains('hidden')) {
              window.startChat()
              document.getElementById('chat-input')?.focus()
            }`}
          title="Toggle Chat"
          id="chat-icon"
        >
          <MessageSquare class="h-5 hover:text-orange-500 transition-colors duration-200 ease-in-out" />
        </a>
        <span id="chat-heading" class="hidden text-sm font-semibold">
          Chat
        </span>
      </nav>
      <div id="chat-root" class="hidden"></div>
    </>
  )
}
