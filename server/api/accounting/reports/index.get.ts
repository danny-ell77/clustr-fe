import { defineEventHandler } from 'h3'

const reports = [
  { id: 'r1', date: '2023-09-02', name: 'Boiler check', assignee: 'David', status: 'open' },
  { id: 'r2', date: '2023-09-05', name: 'HVAC', assignee: 'Sarah', status: 'in_review' },
  { id: 'r3', date: '2023-09-07', name: 'Roof', assignee: 'Alex', status: 'resolved' },
]

export default defineEventHandler(() => ({ reports }))
