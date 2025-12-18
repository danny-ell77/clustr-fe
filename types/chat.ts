import type { UserSummary } from './users'

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
  ANNOUNCEMENT = 'announcement',
  SUPPORT = 'support'
}

export enum ChatStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DISABLED = 'disabled'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  LOCATION = 'location',
  SYSTEM = 'system',
  ANNOUNCEMENT = 'announcement'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  PENDING = 'pending',
  MODERATED = 'moderated',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface ChatParticipant {
  id: string
  user: UserSummary
  joinedAt: string
  lastReadAt?: string
  isActive: boolean
  isAdmin?: boolean
  isModerator?: boolean
  canSendMessages?: boolean
  canAddParticipants?: boolean
  notificationSettings?: Record<string, any>
  mutedUntil?: string
}

export interface MessageReplyTo {
  id: string
  content: string
  senderName: string
  createdAt: string
}

export interface Message {
  id: string
  content: string
  messageType: MessageType
  sender: UserSummary
  createdAt: string
  isEdited: boolean
  editedAt?: string
  replyTo?: MessageReplyTo
  attachment?: string
  attachmentName?: string
  attachmentSize?: number
  status: MessageStatus
  isPinned?: boolean
  isDeleted?: boolean
  deletedAt?: string
  metadata?: Record<string, any>
  moderationReason?: string
}

export interface MessageAttachment {
  id: string
  file: string
  originalFilename: string
  fileSize: number
  mimeType: string
  thumbnail?: string
  createdAt: string
  isImage?: boolean
  isVideo?: boolean
  isAudio?: boolean
  fileSizeHuman?: string
}

export interface LastMessage {
  id: string
  content: string
  senderName: string
  createdAt: string
  messageType: MessageType
}

export interface OtherParticipant {
  id: string
  name: string
  emailAddress: string
}

export interface Chat {
  id: string
  chatType: ChatType
  name?: string
  description?: string
  status: ChatStatus
  isPublic: boolean
  isModerated: boolean
  maxParticipants: number
  avatar?: string
  lastMessageAt?: string
  messageCount: number
  createdAt: string
  participants: ChatParticipant[]
  lastMessage?: LastMessage
  unreadCount: number
  otherParticipant?: OtherParticipant
  participantCount?: number
}

export interface ChatSummary {
  id: string
  chatType: ChatType
  name?: string
  lastMessageAt?: string
  lastMessage?: {
    content: string
    senderName: string
    createdAt: string
  }
  unreadCount: number
  otherParticipantName?: string
}

export interface CreateChatDto {
  participantId: string
}

export interface CreateMessageDto {
  content: string
  messageType?: MessageType
  replyToId?: string
  attachment?: File
}

export interface AddParticipantsDto {
  userIds: string[]
}

export interface ChatAnalytics {
  totalChats: number
  activeChats: number
  publicChats: number
  moderatedChats: number
  totalMessages: number
  messagesToday: number
}

export interface ChatParticipantCreateDto {
  userIds: string[]
}
