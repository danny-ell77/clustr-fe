import type { UserSummary } from './users'

export enum IssueType {
    MAINTENANCE = 'MAINTENANCE',
    COMPLAINT = 'COMPLAINT',
    INQUIRY = 'INQUIRY',
    REQUEST = 'REQUEST',
    OTHER = 'OTHER'
}

export enum IssuePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum IssueStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export interface IssueAttachment {
    id: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
    uploadedBy: UserSummary
    createdAt: string
}

export interface IssueComment {
    id: string
    content: string
    author: UserSummary
    isInternal: boolean
    parent?: string
    attachments: IssueAttachment[]
    replies: IssueComment[]
    createdAt: string
    lastModifiedAt: string
}

export interface IssueStatusHistory {
    id: string
    fromStatus: IssueStatus
    toStatus: IssueStatus
    changedBy: UserSummary
    notes: string
    createdAt: string
}

export interface IssueTicket {
    id: string
    issueNo: string
    title: string
    description: string
    issueType: IssueType
    status: IssueStatus
    priority: IssuePriority
    reportedBy: UserSummary
    assignedTo?: UserSummary
    commentsCount: number
    resolutionNotes?: string
    createdAt: string
    lastModifiedAt: string
    resolvedAt?: string
    closedAt?: string
    escalatedAt?: string
    dueDate?: string
}

export interface IssueTicketDetail extends IssueTicket {
    comments: IssueComment[]
    attachments: IssueAttachment[]
    statusHistory: IssueStatusHistory[]
}

export interface CreateIssueTicketDto {
    title: string
    description: string
    issueType: IssueType
    priority: IssuePriority
}

export interface UpdateIssueTicketDto {
    title?: string
    description?: string
    issueType?: IssueType
    status?: IssueStatus
    priority?: IssuePriority
    assignedTo?: string
    resolutionNotes?: string
    dueDate?: string
}

export interface CreateIssueCommentDto {
    content: string
    isInternal?: boolean
    parent?: string
}

export interface CreateIssueAttachmentDto {
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
}

export interface HelpdeskStatistics {
    totalIssues: number
    openIssues: number
    inProgressIssues: number
    resolvedIssues: number
    closedIssues: number
    averageResolutionTime: string
    slaComplianceRate: number
}
