export type MaintenancePriority = 'low' | 'medium' | 'high'
export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'overdue'
export type MaintenanceRecurrence = 'one_time' | 'recurring'

export interface MaintenanceItem {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: string // YYYY-MM-DD
  priority: MaintenancePriority
  status: MaintenanceStatus
  recurrence: MaintenanceRecurrence
}
