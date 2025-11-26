import type { UserSummary } from './users'

export enum AnnouncementCategory {
    GENERAL = 'GENERAL',
    MAINTENANCE = 'MAINTENANCE',
    SECURITY = 'SECURITY',
    EVENT = 'EVENT',
    EMERGENCY = 'EMERGENCY',
    BILLING = 'BILLING',
    OTHER = 'OTHER'
}

export interface AnnouncementAttachment {
    id: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileSizeFormatted: string
    fileType: string
    isImage: boolean
    previewType: 'image' | 'document' | 'file'
    canPreview: boolean
    createdAt: string
}

export interface AnnouncementComment {
    id: string
    content: string
    authorId: string
    authorName: string
    createdAt: string
    lastModifiedAt: string
}

export interface Announcement {
    id: string
    title: string
    content: string
    category: AnnouncementCategory
    authorId: string
    authorName: string
    viewsCount: number
    likesCount: number
    commentsCount: number
    publishedAt?: string
    expiresAt?: string
    isPublished: boolean
    attachments: AnnouncementAttachment[]
    comments: AnnouncementComment[]
    isLikedByUser: boolean
    isReadByUser: boolean
    createdAt: string
    lastModifiedAt: string
}

export interface CreateAnnouncementDto {
    title: string
    content: string
    category: AnnouncementCategory
    publishedAt?: string
    expiresAt?: string
    isPublished?: boolean
    attachmentIds?: string[]
}

export interface UpdateAnnouncementDto {
    title?: string
    content?: string
    category?: AnnouncementCategory
    publishedAt?: string
    expiresAt?: string
    isPublished?: boolean
}

export interface CreateAnnouncementCommentDto {
    content: string
}

export interface AnnouncementEngagementMetrics {
    viewsCount: number
    likesCount: number
    commentsCount: number
    engagementRate: number
}
