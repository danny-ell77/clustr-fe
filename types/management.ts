export interface Announcement {
    id: string
    title: string
    content: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    publishedAt?: string
    createdAt: string
    lastModifiedAt?: string
    attachments?: string[]
}

export interface Bill {
    id: string
    billNumber: string
    title: string
    description?: string
    type: 'electricity' | 'water' | 'security' | 'maintenance' | 'serviceCharge' | 'wasteManagement' | 'other'
    amount: string
    currency: string
    dueDate: string
    paidAmount: string
    remainingAmount: string
    isOverdue: boolean
    isFullyPaid?: boolean
    createdAt: string
    status: string
}

export interface CreateBillDto {
    title: string
    description?: string
    type: string
    amount: string
    dueDate: string
    userId?: string
    applyToAll?: boolean
}

export interface Transaction {
    id: string
    transactionId: string
    amount: string
    type: string
    status: string
    createdAt: string
    description?: string
}

export interface WalletBalance {
    balance: string
    currency: string
    lastUpdated: string
}

export interface MaintenanceLog {
    id: string
    maintenanceNumber: string
    title: string
    description: string
    maintenanceType: string
    propertyType: string
    propertyLocation: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status: string
    scheduledDate?: string
    estimatedDuration?: string
    actualDuration?: string
    cost?: string
    createdAt: string
    lastModifiedAt?: string
}

export interface IssueTicket {
    id: string
    issueNo: string
    title: string
    description: string
    issueType: 'CARPENTRY' | 'PLUMBING' | 'ELECTRICAL' | 'CLEANING' | 'SECURITY' | 'OTHER'
    status: 'SUBMITTED' | 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    reportedBy: any
    assignedTo?: any
    createdAt: string
    lastModifiedAt?: string
}

export interface IssueComment {
    id: string
    content: string
    createdBy: any
    createdAt: string
}

export interface User {
    id: string
    name: string
    emailAddress: string
    phoneNumber: string
    profileImageUrl?: string
    isVerified: boolean
    roles: string[]
    permissions: string[]
}

export interface PaymentDashboard {
    totalRevenue: string
    pendingPayments: string
    overduePayments: string
    recentTransactions: Transaction[]
}

export interface MaintenanceAnalytics {
    totalLogs: number
    completedLogs: number
    pendingLogs: number
    averageCost: string
}

export interface HelpdeskStatistics {
    totalIssues: number
    openIssues: number
    resolvedIssues: number
    averageResolutionTime: string
}
