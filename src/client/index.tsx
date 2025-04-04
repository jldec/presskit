import { createRoot } from 'react-dom/client'
import { usePartySocket } from 'partysocket/react'
import { useState } from 'react'
import { nanoid } from 'nanoid'
import { names, type ChatMessage, type Message } from '../worker/src/shared'

import markdownit from 'markdown-it'
const md = markdownit({
  linkify: true
})

function App() {
  const [name] = useState(() => {
    const user = document.documentElement.dataset.user
    if (user) return user
    const storedName = localStorage.getItem('chatName')
    if (storedName) return storedName
    const newName = names[Math.floor(Math.random() * names.length)]
    localStorage.setItem('chatName', newName)
    return newName
  })
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const socket = usePartySocket({
    party: 'chats', // kebab-cased CHATS binding name
    // TODO: protect against paths with _
    room: window.location.pathname.replace(/\//g, '_'),
    onMessage: (evt) => {
      const message = JSON.parse(evt.data) as Message
      switch (message.type) {
        case 'add':
          let foundIndex = messages.findIndex((m) => m.id === message.id)
          if (foundIndex === -1) {
            // probably someone else who added a message
            setMessages((messages) => [
              ...messages,
              {
                id: message.id,
                content: message.content,
                user: message.user,
                role: message.role
              }
            ])
          } else {
            // this usually means we ourselves added a message
            // and it was broadcasted back
            // so let's replace the message with the new message
            setMessages((messages) => {
              return messages
                .slice(0, foundIndex)
                .concat({
                  id: message.id,
                  content: message.content,
                  user: message.user,
                  role: message.role
                })
                .concat(messages.slice(foundIndex + 1))
            })
          }
          break
        case 'update':
          setMessages((messages) =>
            messages.map((m) =>
              m.id === message.id
                ? {
                    id: message.id,
                    content: message.content,
                    user: message.user,
                    role: message.role
                  }
                : m
            )
          )
          break
        case 'all':
          setMessages(message.messages)
          break
        case 'clear':
          setMessages([])
          break
      }
    }
  })

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div className="text-xs font-bold ml-2 mt-1">{message.user}</div>
            <div className="bg-orange-50 dark:bg-black p-2 rounded-md prose-p:mt-0">
              <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }}></div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const content = e.currentTarget.elements.namedItem('content') as HTMLInputElement
          const chatMessage: ChatMessage = {
            id: nanoid(8),
            content: content.value,
            user: name,
            role: 'user'
          }
          setMessages((messages) => [...messages, chatMessage])
          // we could broadcast the message here

          socket.send(
            JSON.stringify({
              type: 'add',
              ...chatMessage
            } satisfies Message)
          )

          content.value = ''
        }}
      >
        <div>
          <input
            id="chat-input"
            type="text"
            name="content"
            placeholder={`Type a message...`}
            autoComplete="off"
            className="rounded-md text-black"
          />
        </div>
        <button type="submit">Send</button>
        <button
          onClick={(e) => {
            e.preventDefault()
            setMessages([])
            socket.send(
              JSON.stringify({
                type: 'clear'
              } satisfies Message)
            )
          }}
        >
          Clear
        </button>
      </form>
    </div>
  )
}

const root = createRoot(document.getElementById('chat-root')!)

let hydrated = false

// @ts-expect-error
window.startChat = function() {
  if (!hydrated) {
    hydrated = true
    root.render(<App />)
  }
}

if (new URLSearchParams(window.location.search).has('chat')) {
  document.getElementById('chat-icon')?.click();
}