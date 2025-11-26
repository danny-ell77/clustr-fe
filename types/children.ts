export enum ChildGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

export enum ExitRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DENIED = 'DENIED',
    EXPIRED = 'EXPIRED',
    USED = 'USED'
}

export enum EntryExitLogType {
    EXIT = 'EXIT',
    ENTRY = 'ENTRY'
}

export enum EntryExitStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    OVERDUE = 'OVERDUE'
}

export interface EmergencyContact {
    name: string
    phone: string
    relationship: string
}

export interface Child {
    id: string
    name: string
    dateOfBirth: string
    gender: ChildGender
    profilePhoto?: string
    houseNumber: string
    parent: string
    parentName: string
    emergencyContacts: EmergencyContact[]
    emergencyContactsDisplay: string
    isActive: boolean
    notes?: string
    age: number
    createdAt: string
    lastModifiedAt: string
}

export interface ExitRequest {
    id: string
    requestId: string
    child: string
    childName: string
    requestedBy: string
    requestedByName: string
    reason: string
    expectedReturnTime: string
    destination: string
    accompanyingAdult: string
    accompanyingAdultPhone: string
    status: ExitRequestStatus
    approvedBy?: string
    approvedByName?: string
    approvedAt?: string
    deniedBy?: string
    deniedByName?: string
    deniedAt?: string
    denialReason?: string
    expiresAt: string
    isExpired: boolean
    isPending: boolean
    createdAt: string
    lastModifiedAt: string
}

export interface EntryExitLog {
    id: string
    child: string
    childName: string
    exitRequest?: string
    logType: EntryExitLogType
    date: string
    exitTime?: string
    entryTime?: string
    expectedReturnTime?: string
    actualReturnTime?: string
    reason: string
    destination: string
    accompanyingAdult: string
    status: EntryExitStatus
    verifiedBy?: string
    verifiedByName?: string
    notes?: string
    isOverdue: boolean
    durationMinutes?: number
    createdAt: string
    lastModifiedAt: string
}

export interface CreateChildDto {
    name: string
    dateOfBirth: string
    gender: ChildGender
    profilePhoto?: string
    houseNumber: string
    emergencyContacts: EmergencyContact[]
    notes?: string
}

export interface UpdateChildDto {
    name?: string
    dateOfBirth?: string
    gender?: ChildGender
    profilePhoto?: string
    houseNumber?: string
    emergencyContacts?: EmergencyContact[]
    isActive?: boolean
    notes?: string
}

export interface CreateExitRequestDto {
    child: string
    reason: string
    expectedReturnTime: string
    destination: string
    accompanyingAdult: string
    accompanyingAdultPhone: string
    expiresAt: string
}

export interface UpdateExitRequestDto {
    reason?: string
    expectedReturnTime?: string
    destination?: string
    accompanyingAdult?: string
    accompanyingAdultPhone?: string
    expiresAt?: string
}

export interface ExitRequestApprovalDto {
    action: 'approve' | 'deny'
    reason?: string
}

export interface CreateEntryExitLogDto {
    child: string
    exitRequest?: string
    logType: EntryExitLogType
    date: string
    expectedReturnTime?: string
    reason: string
    destination: string
    accompanyingAdult: string
    notes?: string
}

export interface UpdateEntryExitLogDto {
    expectedReturnTime?: string
    reason?: string
    destination?: string
    accompanyingAdult?: string
    notes?: string
    status?: EntryExitStatus
}

export interface EntryExitActionDto {
    action: 'markExit' | 'markEntry' | 'markOverdue'
    notes?: string
}
