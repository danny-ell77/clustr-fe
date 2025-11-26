export enum CategoryEnum {
  News = "News",
  "Estate Issues" = "Estate Issues",
  Others = "Others",
}

export enum EventStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum EventGuestStatusEnum {
  INVITED = "INVITED",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
  ATTENDED = "ATTENDED",
  CANCELLED = "CANCELLED",
}

interface BaseModel {
  id?: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

interface BaseAnnouncement {
  title: string;
  content: string;
  category?: CategoryEnum;
  publishedAt?: string;
  expiresAt?: string;
  isPublished?: boolean;
}

interface BaseEvent {
  title: string;
  description?: string;
  eventDate: string;
  eventTime: string;
  endTime?: string;
  location: string;
  maxGuests?: number;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastTimestamp: string; // ISO
  unread: number;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string; // ISO
  attachments?: { id: string; url: string; name: string; type: string }[];
  mine?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  attendees: string[];
  notes?: string;
}

export interface AnnouncementAttachment {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileSizeFormatted?: string;
  fileType: string;
  isImage?: boolean;
  previewType?: string;
  canPreview?: string;
  createdAt?: string;
}

export interface AnnouncementComment extends BaseModel {
  content: string;
  authorId?: string;
  authorName?: string;
}

export interface Announcement extends BaseModel, BaseAnnouncement {
  authorId?: string;
  authorName?: string;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  attachments?: AnnouncementAttachment[];
  comments?: AnnouncementComment[];
  isLikedByUser?: string;
  isReadByUser?: string;
}

export interface AnnouncementCreate extends BaseAnnouncement {
  attachmentIds?: string[];
}

export interface AnnouncementUpdate extends BaseAnnouncement { }

export interface Event extends BaseModel, BaseEvent {
  accessCode?: string;
  guestsAdded?: number;
  createdBy: string;
  status?: EventStatusEnum;
  guestsCount?: string;
}

export interface EventCreate extends BaseEvent { }

export interface EventGuest extends BaseModel {
  event: string;
  guest: string;
  guestName?: string;
  status?: "pending" | "approved" | "denied" | "checkedIn" | "checkedOut";
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

export interface EventGuestCreate {
  event: string;
  guest: string;
  notes?: string;
}

export interface EventGuestUpdate {
  status?: "pending" | "approved" | "denied" | "checkedIn" | "checkedOut";
  notes?: string;
}

export interface EventGuestCheckIn {
  notes?: string;
}

export interface EventGuestCheckOut {
  notes?: string;
}

export interface EventUpdate extends BaseEvent { }

export interface UserSummary {
  id?: string;
  name?: string;
  emailAddress?: string;
  profileImageUrl?: string;
}

export interface BulkGuestCreate {
  guests: Record<string, any>[];
}

export interface Notification {
  id?: string;
  recipient: string;
  recipientName?: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "alert" | "update" | "reminder";
  status?: "unread" | "read" | "archived";
  relatedObject?: object;
  createdAt?: string;
}
