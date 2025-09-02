export type ReportStatus = 'new' | 'open' | 'in_review' | 'resolved' | 'closed'

export interface Report {
  id: string
  date: string // YYYY-MM-DD
  name: string
  assignee: string
  status: ReportStatus
  priority?: 'low' | 'medium' | 'high'
}
