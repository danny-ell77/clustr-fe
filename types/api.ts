export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface ApiError {
    message: string
    code?: string
    details?: Record<string, any>
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}
