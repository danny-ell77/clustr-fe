import { defineEventHandler } from 'h3'

const allMessages = [
  { id: 'm1', conversationId: 'c1', senderId: 'u1', senderName: 'Jane Doe', body: 'Hi', createdAt: new Date().toISOString(), mine: false },
  { id: 'm2', conversationId: 'c1', senderId: 'me', senderName: 'Me', body: 'Hello', createdAt: new Date().toISOString(), mine: true },
]

export default defineEventHandler((event) => {
  const conversationId = event.node.req.url?.split('?')[1]?.split('=')[1]
  const messages = allMessages.filter(m => m.conversationId === conversationId)
  return { messages }
})
