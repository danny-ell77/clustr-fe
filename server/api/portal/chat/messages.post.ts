import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = {
    id: `m${Date.now()}`,
    conversationId: body.conversationId,
    senderId: 'me',
    senderName: 'Me',
    body: body.text,
    attachments: body.attachments || [],
    createdAt: new Date().toISOString(),
  }
  return { message }
})
