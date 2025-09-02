export interface Conversation {
  id: string
  name: string
  lastMessage: string
  lastTimestamp: string // ISO
  unread: number
  avatarUrl?: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  body: string
  createdAt: string // ISO
  attachments?: { id: string; url: string; name: string; type: string }[]
  mine?: boolean
}

export interface Meeting {
  id: string
  title: string
  date: string // YYYY-MM-DD
  start: string // HH:mm
  end: string // HH:mm
  attendees: string[]
  notes?: string
}
