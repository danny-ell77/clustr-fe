import type { Visitor } from './visitors'

export enum InvitationRecurrenceType {
    NONE = 'NONE',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    CUSTOM = 'CUSTOM'
}

export enum InvitationStatus {
    ACTIVE = 'ACTIVE',
    REVOKED = 'REVOKED',
    EXPIRED = 'EXPIRED',
    COMPLETED = 'COMPLETED'
}

export interface Invitation {
    id: string
    visitor: string
    visitorDetails?: Visitor
    title: string
    description?: string
    startDate: string
    endDate: string
    recurrenceType: InvitationRecurrenceType
    recurrenceDays?: string
    recurrenceDayOfMonth?: number
    status: InvitationStatus
    createdBy: string
    revokedBy?: string
    revokedAt?: string
    revocationReason?: string
    createdAt: string
    lastModifiedAt: string
}

export interface CreateInvitationDto {
    visitor: string
    title: string
    description?: string
    startDate: string
    endDate: string
    recurrenceType: InvitationRecurrenceType
    recurrenceDays?: string
    recurrenceDayOfMonth?: number
}

export interface UpdateInvitationDto {
    title?: string
    description?: string
    startDate?: string
    endDate?: string
    recurrenceType?: InvitationRecurrenceType
    recurrenceDays?: string
    recurrenceDayOfMonth?: number
    status?: InvitationStatus
}

export interface RevokeInvitationDto {
    revocationReason?: string
}
