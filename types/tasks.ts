import type { UserSummary } from './users'

export enum TaskType {
    MAINTENANCE = 'MAINTENANCE',
    INSPECTION = 'INSPECTION',
    CLEANING = 'CLEANING',
    SECURITY = 'SECURITY',
    ADMINISTRATIVE = 'ADMINISTRATIVE',
    OTHER = 'OTHER'
}

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ON_HOLD = 'ON_HOLD'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum TaskAttachmentType {
    INSTRUCTION = 'INSTRUCTION',
    REFERENCE = 'REFERENCE',
    EVIDENCE = 'EVIDENCE',
    COMPLETION = 'COMPLETION',
    OTHER = 'OTHER'
}

export interface TaskAttachment {
    id: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
    attachmentType: TaskAttachmentType
    uploadedBy: UserSummary
    createdAt: string
}

export interface TaskComment {
    id: string
    content: string
    author: UserSummary
    isInternal: boolean
    parent?: string
    replies: TaskComment[]
    createdAt: string
    lastModifiedAt: string
}

export interface TaskStatusHistory {
    id: string
    fromStatus: TaskStatus
    toStatus: TaskStatus
    changedBy: UserSummary
    notes: string
    createdAt: string
}

export interface TaskEscalationHistory {
    id: string
    escalatedTo: UserSummary
    escalatedBy: UserSummary
    reason: string
    createdAt: string
}

export interface TaskAssignment {
    id: string
    assignedTo: UserSummary
    assignedBy: UserSummary
    assignedAt: string
    notes?: string
}

export interface Task {
    id: string
    taskNumber: string
    title: string
    taskType: TaskType
    priority: TaskPriority
    status: TaskStatus
    assignedTo?: UserSummary
    createdBy: UserSummary
    dueDate?: string
    location?: string
    estimatedHours?: number
    actualHours?: number
    escalatedTo?: UserSummary
    escalatedAt?: string
    startedAt?: string
    completedAt?: string
    createdAt: string
    lastModifiedAt: string
    isOverdue: boolean
    isDueSoon: boolean
    timeRemaining?: string
    durationWorked: string
}

export interface TaskDetail extends Task {
    description: string
    notes?: string
    completionNotes?: string
    attachments: TaskAttachment[]
    comments: TaskComment[]
    statusHistory: TaskStatusHistory[]
    escalationHistory: TaskEscalationHistory[]
    assignmentHistory: TaskAssignment[]
    commentsCount: number
}

export interface CreateTaskDto {
    title: string
    description: string
    taskType: TaskType
    priority: TaskPriority
    assignedToId?: string
    dueDate?: string
    estimatedHours?: number
    location?: string
    notes?: string
}

export interface UpdateTaskDto {
    title?: string
    description?: string
    taskType?: TaskType
    priority?: TaskPriority
    assignedToId?: string
    dueDate?: string
    estimatedHours?: number
    actualHours?: number
    location?: string
    notes?: string
}

export interface TaskAssignmentRequestDto {
    assignedToId: string
    notes?: string
}

export interface TaskStatusUpdateDto {
    status: TaskStatus
    notes?: string
    completionNotes?: string
    actualHours?: number
}

export interface TaskEscalationRequestDto {
    escalatedToId: string
    reason: string
}

export interface CreateTaskCommentDto {
    content: string
    isInternal?: boolean
    parent?: string
}

export interface TaskStatistics {
    totalTasks: number
    statusBreakdown: Record<string, number>
    priorityBreakdown: Record<string, number>
    typeBreakdown: Record<string, number>
    overdueTasks: number
    dueSoonTasks: number
    averageCompletionHours?: number
}

export interface TaskFileUploadDto {
    file: File
    attachmentType?: TaskAttachmentType
}
