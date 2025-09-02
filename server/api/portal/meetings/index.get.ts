import { defineEventHandler } from 'h3'

const events = [
  { id:'e1', title:'Monthly review', date: new Date().toISOString().slice(0,10), start:'09:00', end:'10:00', attendees: [] },
]

export default defineEventHandler(() => ({ events }))
