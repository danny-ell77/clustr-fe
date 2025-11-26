export enum VisitType {
    ONE_TIME = 'ONE_TIME',
    SHORT_STAY = 'SHORT_STAY',
    EXTENDED_STAY = 'EXTENDED_STAY'
}

export enum VisitorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    EXPIRED = 'EXPIRED'
}

export enum ValidFor {
    ONE_TIME = 'ONE_TIME',
    MULTIPLE = 'MULTIPLE'
}

export enum VisitorLogType {
    SCHEDULED = 'SCHEDULED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED'
}

export interface Visitor {
    id: string
    name: string
    email?: string
    phone: string
    estimatedArrival: string
    visitType: VisitType
    accessCode: string
    invitedBy: string
    status: VisitorStatus
    validFor: ValidFor
    validDate: string
    purpose?: string
    notes?: string
    createdAt: string
    lastModifiedAt: string
}

export interface VisitorLog {
    id: string
    visitor: string
    visitorName: string
    date: string
    arrivalTime?: string
    departureTime?: string
    logType: VisitorLogType
    checkedInBy?: string
    checkedOutBy?: string
    notes?: string
    createdAt: string
    lastModifiedAt: string
}

export interface CreateVisitorDto {
    name: string
    email?: string
    phone: string
    estimatedArrival: string
    visitType: VisitType
    validFor: ValidFor
    validDate: string
    purpose?: string
    notes?: string
}

export interface UpdateVisitorDto {
    name?: string
    email?: string
    phone?: string
    estimatedArrival?: string
    visitType?: VisitType
    status?: VisitorStatus
    validFor?: ValidFor
    validDate?: string
    purpose?: string
    notes?: string
}

export interface CreateVisitorLogDto {
    visitor: string
    arrivalTime?: string
    departureTime?: string
    logType: VisitorLogType
    notes?: string
}

export interface CheckInDto {
    notes?: string
}

export interface CheckOutDto {
    notes?: string
}

export interface ValidateAccessCodeDto {
    accessCode: string
}

export interface ValidateAccessCodeResponse {
    valid: boolean
}
