export enum EmergencyType {
    FIRE = 'FIRE',
    MEDICAL = 'MEDICAL',
    SECURITY = 'SECURITY',
    ACCIDENT = 'ACCIDENT',
    NATURAL_DISASTER = 'NATURAL_DISASTER',
    UTILITY_FAILURE = 'UTILITY_FAILURE',
    OTHER = 'OTHER'
}

export enum EmergencyContactType {
    PERSONAL = 'PERSONAL',
    ESTATE_WIDE = 'ESTATE_WIDE'
}

export enum EmergencyStatus {
    PENDING = 'PENDING',
    ACKNOWLEDGED = 'ACKNOWLEDGED',
    RESPONDING = 'RESPONDING',
    RESOLVED = 'RESOLVED',
    CANCELLED = 'CANCELLED'
}

export enum EmergencyPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface EmergencyContact {
    id: string
    name: string
    phoneNumber: string
    email?: string
    emergencyTypes: EmergencyType[]
    emergencyTypesDisplay: string[]
    contactType: EmergencyContactType
    contactTypeDisplay: string
    user?: string
    userName?: string
    isActive: boolean
    isPrimary: boolean
    responseTimeMinutes?: number
    notes?: string
    createdAt: string
    lastModifiedAt: string
}

export interface SOSAlert {
    id: string
    alertId: string
    user: string
    userName: string
    emergencyType: EmergencyType
    emergencyTypeDisplay: string
    description: string
    location: string
    status: EmergencyStatus
    statusDisplay: string
    priority: EmergencyPriority
    priorityDisplay: string
    acknowledgedAt?: string
    acknowledgedBy?: string
    acknowledgedByName?: string
    respondedAt?: string
    respondedBy?: string
    respondedByName?: string
    resolvedAt?: string
    resolvedBy?: string
    resolvedByName?: string
    resolutionNotes?: string
    cancelledAt?: string
    cancelledBy?: string
    cancelledByName?: string
    cancellationReason?: string
    responseTimeMinutes?: number
    resolutionTimeMinutes?: number
    isActive: boolean
    createdAt: string
    lastModifiedAt: string
}

export interface EmergencyResponse {
    id: string
    alert: string
    alertId: string
    responder: string
    responderName: string
    responseType: string
    responseTypeDisplay: string
    notes: string
    estimatedArrival?: string
    actualArrival?: string
    createdAt: string
    lastModifiedAt: string
}

export interface CreateEmergencyContactDto {
    name: string
    phoneNumber: string
    email?: string
    emergencyTypes: EmergencyType[]
    contactType: EmergencyContactType
    user?: string
    isActive?: boolean
    isPrimary?: boolean
    responseTimeMinutes?: number
    notes?: string
}

export interface UpdateEmergencyContactDto {
    name?: string
    phoneNumber?: string
    email?: string
    emergencyTypes?: EmergencyType[]
    isActive?: boolean
    isPrimary?: boolean
    responseTimeMinutes?: number
    notes?: string
}

export interface CreateSOSAlertDto {
    emergencyType: EmergencyType
    description: string
    location: string
    priority?: EmergencyPriority
}

export interface UpdateSOSAlertDto {
    description?: string
    location?: string
    priority?: EmergencyPriority
    resolutionNotes?: string
    cancellationReason?: string
}

export interface CreateEmergencyResponseDto {
    alert: string
    responseType: string
    notes: string
    estimatedArrival?: string
    actualArrival?: string
}

export interface EmergencyStatistics {
    totalAlerts: number
    activeAlerts: number
    resolvedAlerts: number
    cancelledAlerts: number
    averageResponseTime: number
    alertsByType: Record<string, number>
    alertsByStatus: Record<string, number>
}

export interface EmergencyReport {
    reportGeneratedAt: string
    filters: Record<string, any>
    summary: Record<string, any>
    timeAnalysis: Record<string, any>
    responderAnalysis: Record<string, any>
    recentAlerts: any[]
}

export interface IncidentReport {
    alertInfo: Record<string, any>
    timeline: any[]
    metrics: Record<string, any>
    involvedContacts: any[]
    responsesSummary: Record<string, any>
    reportGeneratedAt: string
}

export interface EmergencyReportFilters {
    startDate?: string
    endDate?: string
    emergencyType?: EmergencyType
    status?: EmergencyStatus
}
