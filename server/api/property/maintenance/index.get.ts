import { defineEventHandler } from 'h3'

// In-memory dataset for mock
let data = [
  { id:'1', title:'Plumbing', description:'Leak in 2B', assignee:'Alex', dueDate:'2023-09-10', priority:'high', status:'in_progress', recurrence:'one_time' },
  { id:'2', title:'Electrical', description:'Outlet issue', assignee:'Sam', dueDate:'2023-09-12', priority:'medium', status:'scheduled', recurrence:'recurring' },
  { id:'3', title:'Roof', description:'Shingle replace', assignee:'Dana', dueDate:'2023-09-15', priority:'low', status:'completed', recurrence:'one_time' },
]

export default defineEventHandler(() => {
  return { items: data }
})
