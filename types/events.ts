import type { UserSummary } from './users'

export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export enum EventGuestStatus {
    INVITED = 'INVITED',
    CONFIRMED = 'CONFIRMED',
    DECLINED = 'DECLINED',
    ATTENDED = 'ATTENDED',
    NO_SHOW = 'NO_SHOW'
}

export interface EventGuest {
    id: string
    event: string
    name: string
    email?: string
    phone?: string
    accessCode: string
    invitedBy: string
    status: EventGuestStatus
    notes?: string
    checkInTime?: string
    checkOutTime?: string
    createdAt: string
    lastModifiedAt: string
}

export interface Event {
    id: string
    title: string
    description?: string
    eventDate: string
    eventTime: string
    endTime?: string
    location: string
    accessCode: string
    maxGuests?: number
    guestsAdded: number
    createdBy: string
    status: EventStatus
    isPublic: boolean
    requiresApproval: boolean
    guestsCount: number
    createdAt: string
    lastModifiedAt: string
}

export interface CreateEventDto {
    title: string
    description?: string
    eventDate: string
    eventTime: string
    endTime?: string
    location: string
    maxGuests?: number
    status?: EventStatus
    isPublic?: boolean
    requiresApproval?: boolean
}

export interface UpdateEventDto {
    title?: string
    description?: string
    eventDate?: string
    eventTime?: string
    endTime?: string
    location?: string
    maxGuests?: number
    status?: EventStatus
    isPublic?: boolean
    requiresApproval?: boolean
}

export interface CreateEventGuestDto {
    name: string
    email?: string
    phone?: string
    notes?: string
}

export interface BulkGuestCreateDto {
    guests: Array<{
        name: string
        email?: string
        phone?: string
        notes?: string
    }>
}

export interface EventGuestCheckInDto {
    notes?: string
}

export interface EventGuestCheckOutDto {
    notes?: string
}
