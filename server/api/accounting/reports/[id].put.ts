import { defineEventHandler, readBody } from 'h3'

let reports = [
  { id: 'r1', date: '2023-09-02', name: 'Boiler check', assignee: 'David', status: 'open' },
  { id: 'r2', date: '2023-09-05', name: 'HVAC', assignee: 'Sarah', status: 'in_review' },
  { id: 'r3', date: '2023-09-07', name: 'Roof', assignee: 'Alex', status: 'resolved' },
]

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const patch = await readBody(event)
  const i = reports.findIndex(r => r.id === id)
  if (i >= 0) reports[i] = { ...reports[i], ...patch }
  return { report: reports[i] }
})
