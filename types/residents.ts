export enum ApprovalStatus {
    APPROVED = 'APPROVED',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED'
}

export enum ApartmentStatus {
    OCCUPIED = 'OCCUPIED',
    VACANT = 'VACANT'
}

export interface BillsSummary {
    total: number
    paid: number
    unpaid: number
    pending: number
    overdue: number
}

export interface ResidentBill {
    id: string
    billNumber: string
    title: string
    description?: string
    type: string
    amount: string
    currency: string
    dueDate?: string
    paidAmount: string
    paidAt?: string
    isFullyPaid: boolean
    isOverdue: boolean
    createdAt: string
}

export interface Resident {
    id: string
    name: string
    emailAddress: string
    phoneNumber: string
    unitAddress?: string
    propertyType?: string
    apartmentStatus: ApartmentStatus
    approvalStatus: boolean
    approvedByAdmin: boolean
    isVerified: boolean
    isPhoneVerified: boolean
    profileImageUrl?: string
    dateJoined: string
    billsSummary: BillsSummary
}

export interface ResidentDetail extends Resident {
    lastLogin?: string
    bills: ResidentBill[]
}

export interface ResidentStats {
    totalResidents: number
    approvedResidents: number
    pendingApproval: number
    totalBills: number
    paidBills: number
    unpaidBills: number
    pendingBills: number
    overdueBills: number
}

export interface CreateResidentDto {
    name: string
    emailAddress: string
    phoneNumber: string
    unitAddress?: string
    propertyType?: string
    approvedByAdmin?: boolean
    profileImageUrl?: string
}

export interface UpdateResidentDto {
    name?: string
    emailAddress?: string
    phoneNumber?: string
    unitAddress?: string
    propertyType?: string
    approvedByAdmin?: boolean
    profileImageUrl?: string
}

export interface UpdateApprovalStatusDto {
    approved: boolean
}

export interface ResidentFilters {
    search?: string
    approvalStatus?: boolean
    approvedByAdmin?: boolean
    isVerified?: boolean
    apartmentStatus?: ApartmentStatus
    page?: number
    pageSize?: number
}
