import type { PaginatedResponse } from '~/types/api'
import type {
    AccountUser,
    StaffAccount,
    SubuserAccount,
    CreateStaffDto,
    CreateSubuserDto,
    UpdateUserDto
} from '~/types/users'

export interface Role {
    id: string
    name: string
    description?: string
    owner: string
    totalSubusers: number
    permissions: string[]
    createdAt: string
    lastModifiedAt: string
}

export interface CreateRoleDto {
    name: string
    description?: string
    permissions?: string[]
}

export interface UpdateRoleDto {
    name?: string
    description?: string
    permissions?: string[]
}

export interface AssignRoleDto {
    userId: string
    roleIds: string[]
}

export interface ChangePermissionsDto {
    permissions: string[]
}

export interface PasswordChangeDto {
    currentPassword: string
    newPassword: string
    forceLogout?: boolean
}

export interface EmailVerificationDto {
    emailAddress: string
    verifyMode: 'EMAIL' | 'SMS'
}

export interface ResidentImportData {
    file: File
    format?: 'CSV' | 'XLSX' | 'XLS'
}

export interface UserFilters {
    search?: string
    isVerified?: boolean
    isClusterAdmin?: boolean
    isClusterStaff?: boolean
    page?: number
    pageSize?: number
}

export const usersApi = {
    getAll: (params?: UserFilters) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<AccountUser>>('/accounts/users/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<AccountUser>(`/accounts/users/${id}/`, {
            method: 'GET'
        })
    },

    getFromAuth: () => {
        const { $api } = useNuxtApp()
        return $api<AccountUser>('/accounts/users/from-auth/', {
            method: 'GET'
        })
    },

    update: (id: string, data: UpdateUserDto) => {
        const { $api } = useNuxtApp()
        return $api<AccountUser>(`/accounts/users/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    addStaff: (data: CreateStaffDto) => {
        const { $api } = useNuxtApp()
        return $api<StaffAccount>('/accounts/users/add-staff/', {
            method: 'POST',
            body: data
        })
    },

    addUser: (data: CreateSubuserDto) => {
        const { $api } = useNuxtApp()
        return $api<SubuserAccount>('/accounts/users/add-user/', {
            method: 'POST',
            body: data
        })
    },

    changePermissions: (userId: string, permissions: string[]) => {
        const { $api } = useNuxtApp()
        return $api(`/accounts/users/${userId}/change-permissions/`, {
            method: 'POST',
            body: { permissions }
        })
    },

    changePassword: (data: PasswordChangeDto) => {
        const { $api } = useNuxtApp()
        return $api('/accounts/users/change-password/', {
            method: 'POST',
            body: data
        })
    },

    initializeEmailVerification: (data: EmailVerificationDto) => {
        const { $api } = useNuxtApp()
        return $api('/accounts/users/email-verification/', {
            method: 'POST',
            body: data
        })
    },

    importResidents: (data: FormData) => {
        const { $api } = useNuxtApp()
        return $api('/accounts/users/import-members/', {
            method: 'POST',
            body: data
        })
    },

    getImportTemplate: (format: 'CSV' | 'XLSX' | 'XLS' = 'CSV') => {
        const { $api } = useNuxtApp()
        return $api('/accounts/users/resident-import-template/', {
            method: 'GET',
            query: { format }
        })
    },

    approveAccount: (userId: string) => {
        const { $api } = useNuxtApp()
        return $api(`/accounts/users/${userId}/approve-account/`, {
            method: 'POST'
        })
    },

    roles: {
        getAll: () => {
            const { $api } = useNuxtApp()
            return $api<Role[]>('/accounts/roles/', {
                method: 'GET'
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Role>(`/accounts/roles/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateRoleDto) => {
            const { $api } = useNuxtApp()
            return $api<Role>('/accounts/roles/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateRoleDto) => {
            const { $api } = useNuxtApp()
            return $api<Role>(`/accounts/roles/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/accounts/roles/${id}/`, {
                method: 'DELETE'
            })
        }
    }
}
