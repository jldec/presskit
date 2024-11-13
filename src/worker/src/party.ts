// Original code copied from https://github.com/threepointone/durable-chat
// MIT License (c) 2024 Sunil Pai
import { type Connection, type ConnectionContext, Server, type WSMessage } from 'partyserver'
import { nanoid } from 'nanoid'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import type { ChatMessage, Message } from './shared'
import type { PageData } from './types'

type Env = {
  AI: Ai
  PAGE_CACHE: KVNamespace
}

export class Party extends Server<Env> {
  messages = [] as ChatMessage[]
  pageData: PageData | undefined = undefined

  sendMessage(connection: Connection, message: Message) {
    connection.send(JSON.stringify(message))
  }

  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude)
  }

  async onConnect(connection: Connection, ctx: ConnectionContext) {
    const path = ctx.request.headers.get('x-partykit-room')?.replace('_','/')
    if (path && !this.pageData) {
      const cachedContent = await this.env.PAGE_CACHE.get(path)
      if (cachedContent !== null) {
        this.pageData = JSON.parse(cachedContent) as PageData
      }
    }
    this.sendMessage(connection, {
      type: 'all',
      messages: this.messages
    })
  }

  async onMessage(connection: Connection, message: WSMessage) {
    // let's broadcast the raw message to everyone else
    this.broadcast(message)

    // let's update our local messages store
    const parsed = JSON.parse(message as string) as Message

    if (parsed.type === 'add') {
      // add the message to the local store
      this.messages.push(parsed)
      // let's ask AI to respond as well for fun
      const aiMessage = {
        id: nanoid(8),
        content: '...',
        user: 'AI',
        role: 'assistant'
      } as const

      this.broadcastMessage({
        type: 'add',
        ...aiMessage
      })

      const messages = [{
        role: 'system',
        content: 'talk about this content only: ' + this.pageData?.md
      }]

      const aiMessageStream = (await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        stream: true,
        messages: messages.concat(this.messages.map((m) => ({
          content: m.content,
          role: m.role
        })))
      })) as ReadableStream

      this.messages.push(aiMessage)

      const eventStream = aiMessageStream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())

      // We want the AI to respond to the message in real-time
      // so we're going to stream every chunk as an "update" message

      let buffer = ''

      for await (const event of eventStream) {
        if (event.data !== '[DONE]') {
          // let's append the response to the buffer
          buffer += JSON.parse(event.data).response
          // and broadcast the buffer as an update
          this.broadcastMessage({
            type: 'update',
            ...aiMessage,
            content: buffer + '...' // let's add an ellipsis to show it's still typing
          })
        } else {
          // the AI is done responding
          // we update our local messages store with the final response
          this.messages = this.messages.map((m) => {
            if (m.id === aiMessage.id) {
              return {
                ...m,
                content: buffer
              }
            }
            return m
          })

          // let's update the message with the final response
          this.broadcastMessage({
            type: 'update',
            ...aiMessage,
            content: buffer
          })
        }
      }
    } else if (parsed.type === 'update') {
      // update the message in the local store
      const index = this.messages.findIndex((m) => m.id === parsed.id)
      this.messages[index] = parsed
    }
  }
}
