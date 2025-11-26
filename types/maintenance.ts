import type { UserSummary } from './users'

export enum MaintenanceType {
    PREVENTIVE = 'PREVENTIVE',
    CORRECTIVE = 'CORRECTIVE',
    EMERGENCY = 'EMERGENCY',
    ROUTINE = 'ROUTINE',
    INSPECTION = 'INSPECTION'
}

export enum PropertyType {
    BUILDING = 'BUILDING',
    ELECTRICAL = 'ELECTRICAL',
    PLUMBING = 'PLUMBING',
    HVAC = 'HVAC',
    LANDSCAPING = 'LANDSCAPING',
    SECURITY = 'SECURITY',
    OTHER = 'OTHER'
}

export enum MaintenancePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum MaintenanceStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ON_HOLD = 'ON_HOLD'
}

export interface MaintenanceLog {
    id: string
    maintenanceNumber: string
    title: string
    description: string
    maintenanceType: MaintenanceType
    maintenanceTypeDisplay: string
    propertyType: PropertyType
    propertyTypeDisplay: string
    propertyLocation: string
    equipmentName?: string
    priority: MaintenancePriority
    priorityDisplay: string
    status: MaintenanceStatus
    statusDisplay: string
    performedBy?: UserSummary
    supervisedBy?: UserSummary
    requestedBy?: UserSummary
    scheduledDate?: string
    startedAt?: string
    completedAt?: string
    estimatedDuration?: string
    actualDuration?: string
    cost?: string
    materialsUsed?: string
    toolsUsed?: string
    notes?: string
    completionNotes?: string
    nextMaintenanceDue?: string
    warrantyExpiry?: string
    isUnderWarranty: boolean
    isOverdue: boolean
    isDueSoon: boolean
    timeRemaining?: string
    durationWorked?: string
    attachmentsCount: number
    commentsCount: number
    totalCost?: string
    createdAt: string
    lastModifiedAt: string
}

export interface CreateMaintenanceLogDto {
    title: string
    description: string
    maintenanceType: MaintenanceType
    propertyType: PropertyType
    propertyLocation: string
    equipmentName?: string
    priority?: MaintenancePriority
    scheduledDate?: string
    estimatedDuration?: string
    cost?: string
    materialsUsed?: string
    toolsUsed?: string
    notes?: string
    nextMaintenanceDue?: string
    warrantyExpiry?: string
}

export interface UpdateMaintenanceLogDto {
    title?: string
    description?: string
    maintenanceType?: MaintenanceType
    propertyType?: PropertyType
    propertyLocation?: string
    equipmentName?: string
    priority?: MaintenancePriority
    status?: MaintenanceStatus
    scheduledDate?: string
    estimatedDuration?: string
    actualDuration?: string
    cost?: string
    materialsUsed?: string
    toolsUsed?: string
    notes?: string
    completionNotes?: string
    nextMaintenanceDue?: string
    warrantyExpiry?: string
}

export interface AssignMaintenanceDto {
    performedBy?: string
    supervisedBy?: string
}

export interface MaintenanceAnalytics {
    totalLogs: number
    completedLogs: number
    pendingLogs: number
    inProgressLogs: number
    averageCost: string
    averageCompletionTime: string
    completionRate: number
    overdueCount: number
    dueSoonCount: number
    byType: Record<string, number>
    byPriority: Record<string, number>
    byStatus: Record<string, number>
}

export interface MaintenanceOptimization {
    preventiveMaintenanceSuggestions: any[]
    costOptimizationOpportunities: any[]
    resourceAllocationRecommendations: any[]
}
