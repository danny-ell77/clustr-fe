import { defineEventHandler } from 'h3'

const conversations = [
  { id: 'c1', name: 'Jane Doe', lastMessage: 'Thanks!', lastTimestamp: new Date().toISOString(), unread: 2 },
  { id: 'c2', name: 'John Carter', lastMessage: 'See you then', lastTimestamp: new Date().toISOString(), unread: 0 },
]

export default defineEventHandler(() => {
  return { conversations }
})
