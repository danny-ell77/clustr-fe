import { defineEventHandler, readBody } from 'h3'

const events: any[] = []

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const item = { ...body, id: body.id || String(Date.now()) }
  events.push(item)
  return { event: item }
})
