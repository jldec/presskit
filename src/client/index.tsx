import { createRoot } from 'react-dom/client'
import { usePartySocket } from 'partysocket/react'
import { useState } from 'react'
import { nanoid } from 'nanoid'

import { names, type ChatMessage, type Message } from '../worker/src/shared'

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
    party: 'c-h-a-t-s', // kebab-cased CHATS binding name
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
      <div>{window.location.pathname}</div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div>
              {message.user}: {message.content}
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
          <input type="text" name="content" placeholder={`Type a message...`} autoComplete="off" />
        </div>
        <button type="submit">Send</button>
        <button onClick={(e) => {
          e.preventDefault()
          setMessages([])
          socket.send(
            JSON.stringify({
              type: 'clear'
            } satisfies Message)
          )
        }}>Clear</button>
      </form>
    </div>
  )
}

const root = createRoot(document.getElementById('chat-root')!)

root.render(<App />)
