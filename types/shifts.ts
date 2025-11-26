import type { UserSummary } from './users'

export enum ShiftType {
    SECURITY = 'SECURITY',
    MAINTENANCE = 'MAINTENANCE',
    CLEANING = 'CLEANING',
    RECEPTION = 'RECEPTION',
    OTHER = 'OTHER'
}

export enum ShiftStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
    CANCELLED = 'CANCELLED'
}

export enum ShiftSwapStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export interface StaffSummary {
    id: string
    name: string
    emailAddress: string
    phoneNumber: string
}

export interface ShiftAttendance {
    clockInTime?: string
    clockOutTime?: string
    breakStartTime?: string
    breakEndTime?: string
    totalBreakDuration?: string
    overtimeHours?: string
    overtimeHoursDecimal: number
    lateArrivalMinutes: number
    earlyDepartureMinutes: number
    actualWorkDurationHours: number
    attendanceNotes?: string
}

export interface Shift {
    id: string
    title: string
    shiftType: ShiftType
    shiftTypeDisplay: string
    assignedStaff: string
    assignedStaffDetails: StaffSummary
    startTime: string
    endTime: string
    actualStartTime?: string
    actualEndTime?: string
    status: ShiftStatus
    statusDisplay: string
    location?: string
    responsibilities?: string
    notes?: string
    isRecurring: boolean
    recurrencePattern?: string
    durationHours: number
    actualDurationHours: number
    isOverdue: boolean
    isUpcoming: boolean
    attendance?: ShiftAttendance
    createdAt: string
    lastModifiedAt: string
}

export interface ShiftSwapRequest {
    id: string
    originalShift: string
    originalShiftDetails: Shift
    requestedBy: string
    requestedByDetails: StaffSummary
    requestedWith: string
    requestedWithDetails: StaffSummary
    targetShift?: string
    targetShiftDetails?: Shift
    reason: string
    status: ShiftSwapStatus
    statusDisplay: string
    approvedBy?: string
    approvedByDetails?: StaffSummary
    approvedAt?: string
    responseMessage?: string
    createdAt: string
}

export interface CreateShiftDto {
    title: string
    shiftType: ShiftType
    assignedStaff: string
    startTime: string
    endTime: string
    location?: string
    responsibilities?: string
    notes?: string
    isRecurring?: boolean
    recurrencePattern?: string
}

export interface UpdateShiftDto {
    title?: string
    shiftType?: ShiftType
    assignedStaff?: string
    startTime?: string
    endTime?: string
    location?: string
    responsibilities?: string
    notes?: string
    isRecurring?: boolean
    recurrencePattern?: string
}

export interface CreateShiftSwapRequestDto {
    originalShift: string
    requestedWith: string
    targetShift?: string
    reason: string
}

export interface ShiftSwapResponseDto {
    action: 'approve' | 'reject'
    responseMessage?: string
}

export interface ClockInOutDto {
    timestamp?: string
    notes?: string
}

export interface ShiftStatistics {
    totalShifts: number
    completedShifts: number
    noShowShifts: number
    cancelledShifts: number
    attendanceRate: number
    averageOvertimeHours: number
}
