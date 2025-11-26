export interface UserSummary {
    id: string
    name: string
    emailAddress: string
    profileImageUrl?: string
}

export interface AccountUser extends UserSummary {
    phoneNumber: string
    isVerified: boolean
    isOwner: boolean
    isClusterAdmin: boolean
    isClusterStaff: boolean
}

export interface StaffAccount extends AccountUser {
    roles: string[]
}

export interface SubuserAccount extends AccountUser {
    permissions: string[]
}

export interface CreateStaffDto {
    emailAddress: string
    name: string
    phoneNumber: string
    profileImageUrl?: string
    roles?: string[]
}

export interface CreateSubuserDto {
    emailAddress: string
    name: string
    phoneNumber: string
    profileImageUrl?: string
    permissions?: string[]
}

export interface UpdateUserDto {
    name?: string
    phoneNumber?: string
    profileImageUrl?: string
    roles?: string[]
    permissions?: string[]
}
