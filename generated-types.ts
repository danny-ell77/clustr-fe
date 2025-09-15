// Auto-generated TypeScript definitions from JSON Schema

// Generated on: 2025-09-13T20:37:07.528Z



export enum VerifyModeEnum {
  OTP = 'OTP',
  TOKEN = 'TOKEN'
}

export enum FormatEnum {
  CSV = 'CSV',
  XLSX = 'XLSX',
  XLS = 'XLS'
}

export enum TypeEnum {
  ESTATE = 'ESTATE',
  FACILITY = 'FACILITY',
  COMMERCIAL = 'COMMERCIAL',
  MIXED_USE = 'MIXED_USE'
}

export enum ModeEnum {
  OTP = 'OTP',
  TOKEN = 'TOKEN',
  SMS = 'SMS'
}

export enum TypeEnum {
  electricity = 'electricity',
  water = 'water',
  security = 'security',
  maintenance = 'maintenance',
  serviceCharge = 'service_charge',
  wasteManagement = 'waste_management',
  electricityUtility = 'electricity_utility',
  waterUtility = 'water_utility',
  internetUtility = 'internet_utility',
  cableTvUtility = 'cable_tv_utility',
  other = 'other'
}

export enum CategoryEnum {
  clusterManaged = 'cluster_managed',
  userManaged = 'user_managed'
}

export enum ProviderTypeEnum {
  electricity = 'electricity',
  water = 'water',
  security = 'security',
  maintenance = 'maintenance',
  serviceCharge = 'service_charge',
  wasteManagement = 'waste_management',
  electricityUtility = 'electricity_utility',
  waterUtility = 'water_utility',
  internetUtility = 'internet_utility',
  cableTvUtility = 'cable_tv_utility',
  other = 'other'
}

export enum ApiProviderEnum {
  paystack = 'paystack',
  flutterwave = 'flutterwave',
  bankTransfer = 'bank_transfer',
  cash = 'cash'
}

export enum FrequencyEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  quarterly = 'quarterly',
  yearly = 'yearly'
}

export enum StatusEnum {
  active = 'active',
  paused = 'paused',
  cancelled = 'cancelled',
  expired = 'expired'
}

export enum PaymentSourceEnum {
  wallet = 'wallet',
  direct = 'direct'
}

export enum CategoryEnum {
  News = 'News',
  Estate Issues = 'Estate Issues',
  Others = 'Others'
}

export enum GenderEnum {
  male = 'male',
  female = 'female'
}

export enum ContactTypeEnum {
  personal = 'personal',
  estateWide = 'estate_wide',
  official = 'official'
}

export enum ResponseTypeEnum {
  acknowledged = 'acknowledged',
  dispatched = 'dispatched',
  onScene = 'on_scene',
  resolved = 'resolved',
  cancelled = 'cancelled'
}

export enum StatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum StatusEnum {
  INVITED = 'INVITED',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  ATTENDED = 'ATTENDED',
  CANCELLED = 'CANCELLED'
}

export enum IssueTypeEnum {
  CARPENTRY = 'CARPENTRY',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  CLEANING = 'CLEANING',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER'
}

export enum StatusEnum {
  SUBMITTED = 'SUBMITTED',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum FromStatusEnum {
  SUBMITTED = 'SUBMITTED',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum ToStatusEnum {
  SUBMITTED = 'SUBMITTED',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum VisitTypeEnum {
  ONE_TIME = 'ONE_TIME',
  SHORT_STAY = 'SHORT_STAY',
  EXTENDED_STAY = 'EXTENDED_STAY'
}

export enum StatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  EXPIRED = 'EXPIRED'
}

export enum ValidForEnum {
  ONE_TIME = 'ONE_TIME',
  MULTIPLE = 'MULTIPLE'
}

export enum RecurrenceTypeEnum {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM'
}

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED'
}

export enum MaintenanceTypeEnum {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  EMERGENCY = 'EMERGENCY',
  ROUTINE = 'ROUTINE',
  INSPECTION = 'INSPECTION',
  UPGRADE = 'UPGRADE',
  OTHER = 'OTHER'
}

export enum PropertyTypeEnum {
  BUILDING = 'BUILDING',
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  HVAC = 'HVAC',
  SECURITY = 'SECURITY',
  LANDSCAPING = 'LANDSCAPING',
  EQUIPMENT = 'EQUIPMENT',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  OTHER = 'OTHER'
}

export enum StatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED'
}

export enum FrequencyTypeEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM'
}

export enum ShiftTypeEnum {
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  RECEPTION = 'RECEPTION',
  GARDENING = 'GARDENING',
  OTHER = 'OTHER'
}

export enum StatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum StatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum EmergencyTypeEnum {
  health = 'health',
  theft = 'theft',
  domesticViolence = 'domestic_violence',
  fire = 'fire',
  security = 'security',
  accident = 'accident',
  other = 'other'
}

export enum StatusEnum {
  active = 'active',
  acknowledged = 'acknowledged',
  responding = 'responding',
  resolved = 'resolved',
  cancelled = 'cancelled',
  falseAlarm = 'false_alarm'
}

export enum PriorityEnum {
  low = 'low',
  medium = 'medium',
  high = 'high',
  critical = 'critical'
}

export enum TaskTypeEnum {
  MAINTENANCE = 'MAINTENANCE',
  SECURITY = 'SECURITY',
  CLEANING = 'CLEANING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR',
  OTHER = 'OTHER'
}

export enum StatusEnum {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum AttachmentTypeEnum {
  INSTRUCTION = 'INSTRUCTION',
  REFERENCE = 'REFERENCE',
  EVIDENCE = 'EVIDENCE',
  COMPLETION = 'COMPLETION',
  OTHER = 'OTHER'
}

export enum FromStatusEnum {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum ToStatusEnum {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum LogTypeEnum {
  exit = 'exit',
  entry = 'entry'
}

export enum StatusEnum {
  scheduled = 'scheduled',
  inProgress = 'in_progress',
  completed = 'completed',
  overdue = 'overdue'
}

export enum StatusEnum {
  pending = 'pending',
  approved = 'approved',
  denied = 'denied',
  expired = 'expired'
}

export enum LogTypeEnum {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED'
}



export interface Account {
  /** Email address */
  emailAddress: string;
  /** Name of user */
  name: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
  /** Has this user completed email verification flow? */
  isVerified?: boolean;
}

export interface StaffAccount {
  /** Email address */
  emailAddress: string;
  /** Name of user */
  name: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
  /** Has this user completed email verification flow? */
  isVerified?: boolean;
  roles: number[];
}

export interface SubuserAccount {
  /** Email address */
  emailAddress: string;
  /** Name of user */
  name: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
  /** Has this user completed email verification flow? */
  isVerified?: boolean;
  permissions?: string[];
}

export interface PasswordChange {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** Force logout */
  forceLogout?: boolean;
}

export interface EmailVerification {
  /** Email address */
  emailAddress: string;
  /** Verify mode */
  verifyMode: VerifyModeEnum;
}

export interface ResidentImportedData {
  /** A mapping of column header name or index to the Imported Django model entity attribute name.For example, a file can have a header 'The customers first name'. The correct mapping would be{ 'The customers first name': 'first_name' } */
  columnMapping: Record<string, any>;
  /** Optional format of the file. If not provided, the format will be guessed. This will only work if the file name has a suffix */
  format?: FormatEnum;
  /** Does the file have headers? */
  hasHeaders: boolean;
  /** The file to be imported. This file will not be saved permanently. It will only be used to read the import data after which it should be discarded. */
  file?: string;
  /** Should we use the imported data to update data that already exist in your account? */
  shouldUpsert?: boolean;
  /** The default dialing code of imported phone number without dialing code prefix. If you are importing a column with phone numbers, we require the phone numbers to be in E.164 format and have prefix */
  defaultDialingCode?: string;
}

export interface OwnerAccount {
  /** Email address */
  emailAddress: string;
  /** Name of user */
  name: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
  /** Has this user completed email verification flow? */
  isVerified?: boolean;
  /** Password */
  password: string;
  /** Property owner */
  propertyOwner?: boolean;
}

export interface ClusterAdminAccount {
  /** Type of property cluster */
  type?: TypeEnum;
  /** Name of the cluster */
  name: string;
  admin: OwnerAccount;
}

export interface _AuthTokenPair {
  /** Access */
  access: string;
  /** Refresh */
  refresh: string;
}

export interface ForgotPassword {
  /** Email address */
  emailAddress: string;
  /** The type of key to be used for verification */
  mode?: ModeEnum;
}

export interface ResetPassword {
  /** Verification key */
  verificationKey: string;
  /** Password */
  password: string;
  /** Force logout */
  forceLogout?: boolean;
}

export interface AuthTokenPair {
  /** Email address */
  emailAddress: string;
  /** Password */
  password: string;
}

export interface TokenRefresh {
  /** Refresh */
  refresh: string;
  /** Access */
  access?: string;
}

export interface UtilityBill {
  /** UUID primary key */
  id?: string;
  /** Unique bill number */
  billNumber?: string;
  /** Bill title */
  title: string;
  /** Bill description */
  description?: string;
  /** Type of bill */
  type: TypeEnum;
  /** Bill category (cluster-managed or user-managed) */
  category?: CategoryEnum;
  /** Bill amount */
  amount: string;
  /** Currency code */
  currency?: string;
  /** Utility provider for user-managed bills */
  utilityProvider?: string;
  /** Utility provider name */
  utilityProviderName?: string;
  /** Customer ID/meter number for utility bills */
  customerId?: string;
  /** Whether this bill has automated recurring payments */
  isAutomated?: boolean;
  /** Bill due date */
  dueDate: string;
  /** Amount already paid */
  paidAmount?: string;
  /** Remaining amount */
  remainingAmount?: string;
  /** Date and time when bill was paid */
  paidAt?: string;
  /** Is overdue */
  isOverdue?: boolean;
  /** Additional bill metadata */
  metadata?: Record<string, any>;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface UtilityProvider {
  /** UUID primary key */
  id?: string;
  /** Utility provider name */
  name: string;
  /** Type of utility service provided */
  providerType: ProviderTypeEnum;
  /** Payment API provider (Paystack/Flutterwave) */
  apiProvider: ApiProviderEnum;
  /** Unique provider code for API calls (e.g., 'ikeja-electric') */
  providerCode: string;
  /** Whether this provider is currently active */
  isActive?: boolean;
  /** Whether this provider supports customer validation */
  supportsValidation?: boolean;
  /** Whether this provider supports customer info lookup */
  supportsInfoLookup?: boolean;
  /** Minimum payment amount */
  minimumAmount?: string;
  /** Maximum payment amount */
  maximumAmount?: string;
  /** Additional provider metadata and configuration */
  metadata?: Record<string, any>;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface RecurringUtilityPayment {
  /** UUID primary key */
  id?: string;
  /** Recurring payment title */
  title: string;
  /** Recurring payment description */
  description?: string;
  /** Payment amount */
  amount: string;
  /** Currency code */
  currency?: string;
  /** Payment frequency */
  frequency: FrequencyEnum;
  /** Current recurring payment status */
  status?: StatusEnum;
  /** Utility provider for automated utility payments */
  utilityProvider?: string;
  /** Utility provider name */
  utilityProviderName?: string;
  /** Customer ID/meter number for utility payments */
  customerId?: string;
  /** Source of payment (wallet or direct) */
  paymentSource?: PaymentSourceEnum;
  /** Maximum amount that can be spent per payment */
  spendingLimit?: string;
  /** Date when recurring payments should start */
  startDate: string;
  /** Date when recurring payments should end (optional) */
  endDate?: string;
  /** Date of the next scheduled payment */
  nextPaymentDate: string;
  /** Date of the last successful payment */
  lastPaymentDate?: string;
  /** Total number of successful payments made */
  totalPayments?: number;
  /** Number of consecutive failed payment attempts */
  failedAttempts?: number;
  /** Maximum failed attempts before pausing */
  maxFailedAttempts?: number;
  /** Next payment in days */
  nextPaymentInDays?: string;
  /** Can be paused */
  canBePaused?: string;
  /** Can be resumed */
  canBeResumed?: string;
  /** Additional recurring payment metadata */
  metadata?: Record<string, any>;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface AnnouncementAttachment {
  /** UUID primary key */
  id?: string;
  /** Original name of the uploaded file */
  fileName: string;
  /** URL to access the uploaded file */
  fileUrl: string;
  /** Size of the file in bytes */
  fileSize: number;
  /** File size formatted */
  fileSizeFormatted?: string;
  /** MIME type of the file */
  fileType: string;
  /** Whether this attachment is an image */
  isImage?: boolean;
  /** Preview type */
  previewType?: string;
  /** Can preview */
  canPreview?: string;
  /** Creation date */
  createdAt?: string;
}

export interface AnnouncementComment {
  /** UUID primary key */
  id?: string;
  /** Content of the comment */
  content: string;
  /** ID of the user who created the comment */
  authorId?: string;
  /** Author name */
  authorName?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface Announcement {
  /** UUID primary key */
  id?: string;
  /** Title of the announcement */
  title: string;
  /** Content of the announcement */
  content: string;
  /** Category of the announcement */
  category?: CategoryEnum;
  /** ID of the user who created the announcement */
  authorId?: string;
  /** Author name */
  authorName?: string;
  /** Number of times this announcement has been viewed */
  viewsCount?: number;
  /** Number of likes this announcement has received */
  likesCount?: number;
  /** Number of comments on this announcement */
  commentsCount?: number;
  /** When the announcement was published */
  publishedAt?: string;
  /** When the announcement expires */
  expiresAt?: string;
  /** Whether the announcement is published */
  isPublished?: boolean;
  attachments?: AnnouncementAttachment[];
  comments?: AnnouncementComment[];
  /** Is liked by user */
  isLikedByUser?: string;
  /** Is read by user */
  isReadByUser?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface AnnouncementCreate {
  /** Title of the announcement */
  title: string;
  /** Content of the announcement */
  content: string;
  /** Category of the announcement */
  category?: CategoryEnum;
  /** When the announcement was published */
  publishedAt?: string;
  /** When the announcement expires */
  expiresAt?: string;
  /** Whether the announcement is published */
  isPublished?: boolean;
  /** List of pre-uploaded attachment IDs to link to the announcement */
  attachmentIds?: string[];
}

export interface AnnouncementUpdate {
  /** Title of the announcement */
  title: string;
  /** Content of the announcement */
  content: string;
  /** Category of the announcement */
  category?: CategoryEnum;
  /** When the announcement was published */
  publishedAt?: string;
  /** When the announcement expires */
  expiresAt?: string;
  /** Whether the announcement is published */
  isPublished?: boolean;
}

export interface Child {
  /** UUID primary key */
  id?: string;
  /** Full name of the child */
  name: string;
  /** Date of birth of the child */
  dateOfBirth: string;
  /** Gender of the child */
  gender: GenderEnum;
  /** URL to the child's profile photo */
  profilePhoto?: string;
  /** House/unit number where the child lives */
  houseNumber: string;
  /** Parent or guardian of the child */
  parent: string;
  /** Parent name */
  parentName?: string;
  /** List of emergency contact information */
  emergencyContacts?: Record<string, any>;
  /** Emergency contacts display */
  emergencyContactsDisplay?: string;
  /** Whether the child is currently active in the system */
  isActive?: boolean;
  /** Additional notes about the child */
  notes?: string;
  /** Age */
  age?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface ChildCreate {
  /** Full name of the child */
  name: string;
  /** Date of birth of the child */
  dateOfBirth: string;
  /** Gender of the child */
  gender: GenderEnum;
  /** URL to the child's profile photo */
  profilePhoto?: string;
  /** House/unit number where the child lives */
  houseNumber: string;
  /** List of emergency contact information */
  emergencyContacts?: Record<string, any>;
  /** Additional notes about the child */
  notes?: string;
}

export interface ChildUpdate {
  /** Full name of the child */
  name: string;
  /** Date of birth of the child */
  dateOfBirth: string;
  /** Gender of the child */
  gender: GenderEnum;
  /** URL to the child's profile photo */
  profilePhoto?: string;
  /** House/unit number where the child lives */
  houseNumber: string;
  /** List of emergency contact information */
  emergencyContacts?: Record<string, any>;
  /** Whether the child is currently active in the system */
  isActive?: boolean;
  /** Additional notes about the child */
  notes?: string;
}

export interface EmergencyContact {
  /** UUID primary key */
  id?: string;
  /** Name of the emergency contact */
  name: string;
  /** Contact phone number */
  phoneNumber: string;
  /** Contact email address (optional) */
  email?: string;
  /** List of emergency types this contact handles */
  emergencyTypes?: Record<string, any>;
  /** Emergency types display */
  emergencyTypesDisplay?: string;
  /** Type of emergency contact */
  contactType?: ContactTypeEnum;
  /** Contact type display */
  contactTypeDisplay?: string;
  /** User who owns this contact (null for estate-wide contacts) */
  user?: string;
  /** User name */
  userName?: string;
  /** Whether this contact is active and should receive alerts */
  isActive?: boolean;
  /** Whether this is a primary contact for the emergency types */
  isPrimary?: boolean;
  /** Expected response time in minutes */
  responseTimeMinutes?: number;
  /** Additional notes about this contact */
  notes?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface EmergencyContactCreate {
  /** Name of the emergency contact */
  name: string;
  /** Contact phone number */
  phoneNumber: string;
  /** Contact email address (optional) */
  email?: string;
  /** List of emergency types this contact handles */
  emergencyTypes?: Record<string, any>;
  /** Type of emergency contact */
  contactType?: ContactTypeEnum;
  /** User who owns this contact (null for estate-wide contacts) */
  user?: string;
  /** Whether this contact is active and should receive alerts */
  isActive?: boolean;
  /** Whether this is a primary contact for the emergency types */
  isPrimary?: boolean;
  /** Expected response time in minutes */
  responseTimeMinutes?: number;
  /** Additional notes about this contact */
  notes?: string;
}

export interface EmergencyContactUpdate {
  /** Name of the emergency contact */
  name: string;
  /** Contact phone number */
  phoneNumber: string;
  /** Contact email address (optional) */
  email?: string;
  /** List of emergency types this contact handles */
  emergencyTypes?: Record<string, any>;
  /** Whether this contact is active and should receive alerts */
  isActive?: boolean;
  /** Whether this is a primary contact for the emergency types */
  isPrimary?: boolean;
  /** Expected response time in minutes */
  responseTimeMinutes?: number;
  /** Additional notes about this contact */
  notes?: string;
}

export interface EmergencyResponse {
  /** UUID primary key */
  id?: string;
  /** The alert this response is for */
  alert: string;
  /** Alert id */
  alertId?: string;
  /** User who responded */
  responder: string;
  /** Responder name */
  responderName?: string;
  /** Type of response */
  responseType: ResponseTypeEnum;
  /** Response type display */
  responseTypeDisplay?: string;
  /** Response notes */
  notes?: string;
  /** Estimated arrival time */
  estimatedArrival?: string;
  /** Actual arrival time */
  actualArrival?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface EmergencyResponseCreate {
  /** The alert this response is for */
  alert: string;
  /** Type of response */
  responseType: ResponseTypeEnum;
  /** Response notes */
  notes?: string;
  /** Estimated arrival time */
  estimatedArrival?: string;
  /** Actual arrival time */
  actualArrival?: string;
}

export interface Event {
  /** UUID primary key */
  id?: string;
  /** Title of the event */
  title: string;
  /** Detailed description of the event */
  description?: string;
  /** Date of the event */
  eventDate: string;
  /** Start time of the event */
  eventTime: string;
  /** End time of the event */
  endTime?: string;
  /** Location of the event */
  location: string;
  /** Unique access code for the event */
  accessCode?: string;
  /** Maximum number of guests allowed (0 for unlimited) */
  maxGuests?: number;
  /** Number of guests added to the event */
  guestsAdded?: number;
  /** ID of the user who created this event */
  createdBy: string;
  /** Current status of the event */
  status?: StatusEnum;
  /** Whether the event is public or private */
  isPublic?: boolean;
  /** Whether guests require approval to attend */
  requiresApproval?: boolean;
  /** Guests count */
  guestsCount?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface EventCreate {
  /** Title of the event */
  title: string;
  /** Detailed description of the event */
  description?: string;
  /** Date of the event */
  eventDate: string;
  /** Start time of the event */
  eventTime: string;
  /** End time of the event */
  endTime?: string;
  /** Location of the event */
  location: string;
  /** Maximum number of guests allowed (0 for unlimited) */
  maxGuests?: number;
  /** Current status of the event */
  status?: StatusEnum;
  /** Whether the event is public or private */
  isPublic?: boolean;
  /** Whether guests require approval to attend */
  requiresApproval?: boolean;
}

export interface EventGuest {
  /** UUID primary key */
  id?: string;
  /** The event this guest is invited to */
  event: string;
  /** Name of the guest */
  name: string;
  /** Email address of the guest */
  email?: string;
  /** Phone number of the guest */
  phone?: string;
  /** Unique access code for the guest */
  accessCode?: string;
  /** ID of the user who invited this guest */
  invitedBy: string;
  /** Current status of the guest */
  status?: StatusEnum;
  /** Additional notes about the guest */
  notes?: string;
  /** Time when the guest checked in */
  checkInTime?: string;
  /** Time when the guest checked out */
  checkOutTime?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface EventGuestCreate {
  /** Name of the guest */
  name: string;
  /** Email address of the guest */
  email?: string;
  /** Phone number of the guest */
  phone?: string;
  /** Additional notes about the guest */
  notes?: string;
}

export interface EventGuestCheckIn {
  /** Notes */
  notes?: string;
}

export interface EventGuestCheckOut {
  /** Notes */
  notes?: string;
}

export interface EventUpdate {
  /** Title of the event */
  title: string;
  /** Detailed description of the event */
  description?: string;
  /** Date of the event */
  eventDate: string;
  /** Start time of the event */
  eventTime: string;
  /** End time of the event */
  endTime?: string;
  /** Location of the event */
  location: string;
  /** Maximum number of guests allowed (0 for unlimited) */
  maxGuests?: number;
  /** Current status of the event */
  status?: StatusEnum;
  /** Whether the event is public or private */
  isPublic?: boolean;
  /** Whether guests require approval to attend */
  requiresApproval?: boolean;
}

export interface BulkGuestCreate {
  /** List of guests to add to the event */
  guests: Record<string, any>[];
}

export interface UserSummary {
  /** UUID primary key */
  id?: string;
  /** Name of user */
  name?: string;
  /** Email address */
  emailAddress?: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
}

export interface IssueTicketList {
  /** UUID primary key */
  id?: string;
  /** Unique issue number for tracking */
  issueNo?: string;
  /** Brief title describing the issue */
  title: string;
  /** Type of issue being reported */
  issueType?: IssueTypeEnum;
  /** Current status of the issue */
  status?: StatusEnum;
  /** Priority level of the issue */
  priority?: PriorityEnum;
  reportedBy?: UserSummary;
  assignedTo?: UserSummary;
  /** Comments count */
  commentsCount?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
  /** Expected resolution date */
  dueDate?: string;
}

export interface IssueTicketUpdate {
  /** Brief title describing the issue */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Type of issue being reported */
  issueType?: IssueTypeEnum;
  /** Current status of the issue */
  status?: StatusEnum;
  /** Priority level of the issue */
  priority?: PriorityEnum;
  /** Staff member assigned to handle the issue */
  assignedTo?: string;
  /** Notes about how the issue was resolved */
  resolutionNotes?: string;
  /** Expected resolution date */
  dueDate?: string;
}

export interface IssueAttachment {
  /** UUID primary key */
  id?: string;
  /** Original name of the uploaded file */
  fileName: string;
  /** URL to access the uploaded file */
  fileUrl: string;
  /** Size of the file in bytes */
  fileSize: number;
  /** MIME type of the file */
  fileType: string;
  uploadedBy?: UserSummary;
  /** Creation date */
  createdAt?: string;
}

export interface IssueComment {
  /** UUID primary key */
  id?: string;
  /** Content of the comment */
  content: string;
  author?: UserSummary;
  /** Whether this comment is internal (staff only) */
  isInternal?: boolean;
  /** Parent comment for threaded discussions */
  parent?: string;
  attachments?: IssueAttachment[];
  /** Replies */
  replies?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface IssueStatusHistory {
  /** UUID primary key */
  id?: string;
  /** Previous status */
  fromStatus?: FromStatusEnum;
  /** New status */
  toStatus: ToStatusEnum;
  changedBy?: UserSummary;
  /** Notes about the status change */
  notes?: string;
  /** Creation date */
  createdAt?: string;
}

export interface IssueTicketDetail {
  /** UUID primary key */
  id?: string;
  /** Unique issue number for tracking */
  issueNo?: string;
  /** Brief title describing the issue */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Type of issue being reported */
  issueType?: IssueTypeEnum;
  /** Current status of the issue */
  status?: StatusEnum;
  /** Priority level of the issue */
  priority?: PriorityEnum;
  reportedBy?: UserSummary;
  assignedTo?: UserSummary;
  comments?: IssueComment[];
  attachments?: IssueAttachment[];
  statusHistory?: IssueStatusHistory[];
  /** Comments count */
  commentsCount?: string;
  /** Notes about how the issue was resolved */
  resolutionNotes?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
  /** Timestamp when the issue was resolved */
  resolvedAt?: string;
  /** Timestamp when the issue was closed */
  closedAt?: string;
  /** Timestamp when the issue was escalated */
  escalatedAt?: string;
  /** Expected resolution date */
  dueDate?: string;
}

export interface IssueAttachmentCreate {
  /** Original name of the uploaded file */
  fileName: string;
  /** URL to access the uploaded file */
  fileUrl: string;
  /** Size of the file in bytes */
  fileSize: number;
  /** MIME type of the file */
  fileType: string;
}

export interface IssueCommentCreate {
  /** Content of the comment */
  content: string;
  /** Whether this comment is internal (staff only) */
  isInternal?: boolean;
  /** Parent comment for threaded discussions */
  parent?: string;
}

export interface Visitor {
  /** UUID primary key */
  id?: string;
  /** Full name of the visitor */
  name: string;
  /** Email address of the visitor */
  email?: string;
  /** Phone number of the visitor */
  phone: string;
  /** Expected date and time of arrival */
  estimatedArrival: string;
  /** Type of visit */
  visitType?: VisitTypeEnum;
  /** Unique access code for the visitor */
  accessCode?: string;
  /** ID of the user who invited this visitor */
  invitedBy: string;
  /** Current status of the visitor */
  status?: StatusEnum;
  /** Validity type of the access code */
  validFor?: ValidForEnum;
  /** Date until which the access code is valid */
  validDate: string;
  /** Purpose or reason for the visit */
  purpose?: string;
  /** Additional notes about the visitor */
  notes?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface Invitation {
  /** UUID primary key */
  id?: string;
  /** The visitor this invitation is for */
  visitor: string;
  visitorDetails?: Visitor;
  /** Title or purpose of the invitation */
  title: string;
  /** Detailed description of the invitation */
  description?: string;
  /** Date when the invitation becomes valid */
  startDate: string;
  /** Date when the invitation expires */
  endDate: string;
  /** Type of recurrence for this invitation */
  recurrenceType?: RecurrenceTypeEnum;
  /** Days of the week for weekly recurrence (comma-separated numbers, 0=Monday) */
  recurrenceDays?: string;
  /** Day of the month for monthly recurrence */
  recurrenceDayOfMonth?: number;
  /** Current status of the invitation */
  status?: StatusEnum;
  /** ID of the user who created this invitation */
  createdBy?: string;
  /** ID of the user who revoked this invitation */
  revokedBy?: string;
  /** Date and time when the invitation was revoked */
  revokedAt?: string;
  /** Reason for revoking the invitation */
  revocationReason?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface InvitationCreate {
  /** The visitor this invitation is for */
  visitor: string;
  /** Title or purpose of the invitation */
  title: string;
  /** Detailed description of the invitation */
  description?: string;
  /** Date when the invitation becomes valid */
  startDate: string;
  /** Date when the invitation expires */
  endDate: string;
  /** Type of recurrence for this invitation */
  recurrenceType?: RecurrenceTypeEnum;
  /** Days of the week for weekly recurrence (comma-separated numbers, 0=Monday) */
  recurrenceDays?: string;
  /** Day of the month for monthly recurrence */
  recurrenceDayOfMonth?: number;
}

export interface InvitationUpdate {
  /** Title or purpose of the invitation */
  title: string;
  /** Detailed description of the invitation */
  description?: string;
  /** Date when the invitation becomes valid */
  startDate: string;
  /** Date when the invitation expires */
  endDate: string;
  /** Type of recurrence for this invitation */
  recurrenceType?: RecurrenceTypeEnum;
  /** Days of the week for weekly recurrence (comma-separated numbers, 0=Monday) */
  recurrenceDays?: string;
  /** Day of the month for monthly recurrence */
  recurrenceDayOfMonth?: number;
  /** Current status of the invitation */
  status?: StatusEnum;
}

export interface InvitationRevoke {
  /** Reason for revoking the invitation */
  revocationReason?: string;
}

export interface MaintenanceLog {
  /** UUID primary key */
  id?: string;
  /** Unique maintenance number for tracking */
  maintenanceNumber?: string;
  /** Brief title describing the maintenance activity */
  title: string;
  /** Detailed description of the maintenance work performed */
  description: string;
  /** Type of maintenance activity */
  maintenanceType?: MaintenanceTypeEnum;
  /** Maintenance type display */
  maintenanceTypeDisplay?: string;
  /** Type of property or equipment maintained */
  propertyType?: PropertyTypeEnum;
  /** Property type display */
  propertyTypeDisplay?: string;
  /** Specific location of the property or equipment */
  propertyLocation: string;
  /** Name or model of the equipment (if applicable) */
  equipmentName?: string;
  /** Priority level of the maintenance */
  priority?: PriorityEnum;
  /** Priority display */
  priorityDisplay?: string;
  /** Current status of the maintenance */
  status?: StatusEnum;
  /** Status display */
  statusDisplay?: string;
  performedBy?: Account;
  supervisedBy?: Account;
  requestedBy?: Account;
  /** Scheduled date and time for the maintenance */
  scheduledDate?: string;
  /** Timestamp when maintenance was started */
  startedAt?: string;
  /** Timestamp when maintenance was completed */
  completedAt?: string;
  /** Estimated time to complete the maintenance */
  estimatedDuration?: string;
  /** Actual time spent on the maintenance */
  actualDuration?: string;
  /** Total cost of the maintenance */
  cost?: string;
  /** List of materials and parts used */
  materialsUsed?: string;
  /** List of tools and equipment used */
  toolsUsed?: string;
  /** Additional notes about the maintenance */
  notes?: string;
  /** Notes about maintenance completion and results */
  completionNotes?: string;
  /** When the next maintenance is due for this item */
  nextMaintenanceDue?: string;
  /** Warranty expiry date for the equipment */
  warrantyExpiry?: string;
  /** Whether the equipment is still under warranty */
  isUnderWarranty?: boolean;
  /** Is overdue */
  isOverdue?: string;
  /** Is due soon */
  isDueSoon?: string;
  /** Time remaining */
  timeRemaining?: string;
  /** Duration worked */
  durationWorked?: string;
  /** Attachments count */
  attachmentsCount?: string;
  /** Comments count */
  commentsCount?: string;
  /** Total cost */
  totalCost?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface MaintenanceLogCreate {
  /** Brief title describing the maintenance activity */
  title: string;
  /** Detailed description of the maintenance work performed */
  description: string;
  /** Type of maintenance activity */
  maintenanceType?: MaintenanceTypeEnum;
  /** Type of property or equipment maintained */
  propertyType?: PropertyTypeEnum;
  /** Specific location of the property or equipment */
  propertyLocation: string;
  /** Name or model of the equipment (if applicable) */
  equipmentName?: string;
  /** Priority level of the maintenance */
  priority?: PriorityEnum;
  /** Scheduled date and time for the maintenance */
  scheduledDate?: string;
  /** Estimated time to complete the maintenance */
  estimatedDuration?: string;
  /** Total cost of the maintenance */
  cost?: string;
  /** List of materials and parts used */
  materialsUsed?: string;
  /** List of tools and equipment used */
  toolsUsed?: string;
  /** Additional notes about the maintenance */
  notes?: string;
  /** When the next maintenance is due for this item */
  nextMaintenanceDue?: string;
  /** Warranty expiry date for the equipment */
  warrantyExpiry?: string;
}

export interface MaintenanceLogUpdate {
  /** Brief title describing the maintenance activity */
  title: string;
  /** Detailed description of the maintenance work performed */
  description: string;
  /** Type of maintenance activity */
  maintenanceType?: MaintenanceTypeEnum;
  /** Type of property or equipment maintained */
  propertyType?: PropertyTypeEnum;
  /** Specific location of the property or equipment */
  propertyLocation: string;
  /** Name or model of the equipment (if applicable) */
  equipmentName?: string;
  /** Priority level of the maintenance */
  priority?: PriorityEnum;
  /** Current status of the maintenance */
  status?: StatusEnum;
  /** Scheduled date and time for the maintenance */
  scheduledDate?: string;
  /** Estimated time to complete the maintenance */
  estimatedDuration?: string;
  /** Actual time spent on the maintenance */
  actualDuration?: string;
  /** Total cost of the maintenance */
  cost?: string;
  /** List of materials and parts used */
  materialsUsed?: string;
  /** List of tools and equipment used */
  toolsUsed?: string;
  /** Additional notes about the maintenance */
  notes?: string;
  /** Notes about maintenance completion and results */
  completionNotes?: string;
  /** When the next maintenance is due for this item */
  nextMaintenanceDue?: string;
  /** Warranty expiry date for the equipment */
  warrantyExpiry?: string;
}

export interface MaintenanceSchedule {
  /** UUID primary key */
  id?: string;
  /** Name of the maintenance schedule */
  name: string;
  /** Description of the scheduled maintenance */
  description: string;
  /** Type of property or equipment */
  propertyType: PropertyTypeEnum;
  /** Property type display */
  propertyTypeDisplay?: string;
  /** Specific location of the property or equipment */
  propertyLocation: string;
  /** Name or model of the equipment (if applicable) */
  equipmentName?: string;
  /** How often the maintenance should be performed */
  frequencyType?: FrequencyTypeEnum;
  /** Frequency type display */
  frequencyTypeDisplay?: string;
  /** Numeric value for custom frequency (e.g., every 3 months) */
  frequencyValue?: number;
  /** When the next maintenance is due */
  nextDueDate: string;
  /** Estimated time to complete the maintenance */
  estimatedDuration?: string;
  /** Estimated cost of the maintenance */
  estimatedCost?: string;
  assignedTo?: Account;
  /** Whether this schedule is active */
  isActive?: boolean;
  /** Instructions for performing the maintenance */
  instructions?: string;
  /** List of materials typically needed */
  materialsNeeded?: string;
  /** List of tools typically needed */
  toolsNeeded?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface MaintenanceScheduleCreate {
  /** Name of the maintenance schedule */
  name: string;
  /** Description of the scheduled maintenance */
  description: string;
  /** Type of property or equipment */
  propertyType: PropertyTypeEnum;
  /** Specific location of the property or equipment */
  propertyLocation: string;
  /** Name or model of the equipment (if applicable) */
  equipmentName?: string;
  /** How often the maintenance should be performed */
  frequencyType?: FrequencyTypeEnum;
  /** Numeric value for custom frequency (e.g., every 3 months) */
  frequencyValue?: number;
  /** When the next maintenance is due */
  nextDueDate: string;
  /** Estimated time to complete the maintenance */
  estimatedDuration?: string;
  /** Estimated cost of the maintenance */
  estimatedCost?: string;
  /** Instructions for performing the maintenance */
  instructions?: string;
  /** List of materials typically needed */
  materialsNeeded?: string;
  /** List of tools typically needed */
  toolsNeeded?: string;
}

export interface Role {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Name */
  name: string;
  /** Description of the role. */
  description?: string;
  /** Total subusers */
  totalSubusers?: number;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
  permissions?: string[];
}

export interface StaffSummary {
  /** UUID primary key */
  id?: string;
  /** Name of user */
  name?: string;
  /** Email address */
  emailAddress?: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber?: string;
}

export interface ShiftAttendance {
  /** Clock in time */
  clockInTime?: string;
  /** Clock out time */
  clockOutTime?: string;
  /** Break start time */
  breakStartTime?: string;
  /** Break end time */
  breakEndTime?: string;
  /** Total time spent on breaks */
  totalBreakDuration?: string;
  /** Hours worked beyond scheduled time */
  overtimeHours?: string;
  /** Overtime hours decimal */
  overtimeHoursDecimal?: string;
  /** Minutes late for shift start */
  lateArrivalMinutes?: number;
  /** Minutes left before shift end */
  earlyDepartureMinutes?: number;
  /** Actual work duration hours */
  actualWorkDurationHours?: string;
  /** Notes about attendance issues or special circumstances */
  attendanceNotes?: string;
}

export interface Shift {
  /** UUID primary key */
  id?: string;
  /** Title or description of the shift */
  title: string;
  /** Type of work shift */
  shiftType?: ShiftTypeEnum;
  /** Shift type display */
  shiftTypeDisplay?: string;
  /** Staff member assigned to this shift */
  assignedStaff: string;
  assignedStaffDetails?: StaffSummary;
  /** Scheduled start time of the shift */
  startTime: string;
  /** Scheduled end time of the shift */
  endTime: string;
  /** Actual time the staff clocked in */
  actualStartTime?: string;
  /** Actual time the staff clocked out */
  actualEndTime?: string;
  /** Current status of the shift */
  status?: StatusEnum;
  /** Status display */
  statusDisplay?: string;
  /** Location where the shift takes place */
  location?: string;
  /** Description of responsibilities for this shift */
  responsibilities?: string;
  /** Additional notes about the shift */
  notes?: string;
  /** Whether this shift repeats */
  isRecurring?: boolean;
  /** Pattern for recurring shifts (daily, weekly, monthly) */
  recurrencePattern?: string;
  /** Duration hours */
  durationHours?: string;
  /** Actual duration hours */
  actualDurationHours?: string;
  /** Is overdue */
  isOverdue?: string;
  /** Is upcoming */
  isUpcoming?: string;
  attendance?: ShiftAttendance;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface ShiftSwapRequest {
  /** UUID primary key */
  id?: string;
  /** Original shift */
  originalShift: string;
  originalShiftDetails?: Shift;
  /** Requested by */
  requestedBy: string;
  requestedByDetails?: StaffSummary;
  /** Requested with */
  requestedWith: string;
  requestedWithDetails?: StaffSummary;
  /** The shift to swap with (optional for coverage requests) */
  targetShift?: string;
  targetShiftDetails?: Shift;
  /** Reason for the swap request */
  reason: string;
  /** Status */
  status?: StatusEnum;
  /** Status display */
  statusDisplay?: string;
  /** Approved by */
  approvedBy?: string;
  approvedByDetails?: StaffSummary;
  /** Approved at */
  approvedAt?: string;
  /** Response message from the other staff member or admin */
  responseMessage?: string;
  /** Creation date */
  createdAt?: string;
}

export interface ShiftSwapRequestCreate {
  /** Original shift */
  originalShift: string;
  /** Requested with */
  requestedWith: string;
  /** The shift to swap with (optional for coverage requests) */
  targetShift?: string;
  /** Reason for the swap request */
  reason: string;
}

export interface ShiftList {
  /** UUID primary key */
  id?: string;
  /** Title or description of the shift */
  title: string;
  /** Type of work shift */
  shiftType?: ShiftTypeEnum;
  /** Shift type display */
  shiftTypeDisplay?: string;
  /** Assigned staff name */
  assignedStaffName?: string;
  /** Scheduled start time of the shift */
  startTime: string;
  /** Scheduled end time of the shift */
  endTime: string;
  /** Current status of the shift */
  status?: StatusEnum;
  /** Status display */
  statusDisplay?: string;
  /** Location where the shift takes place */
  location?: string;
  /** Duration hours */
  durationHours?: string;
  /** Is overdue */
  isOverdue?: string;
  /** Is upcoming */
  isUpcoming?: string;
}

export interface ShiftCreate {
  /** Title or description of the shift */
  title: string;
  /** Type of work shift */
  shiftType?: ShiftTypeEnum;
  /** Staff member assigned to this shift */
  assignedStaff: string;
  /** Scheduled start time of the shift */
  startTime: string;
  /** Scheduled end time of the shift */
  endTime: string;
  /** Location where the shift takes place */
  location?: string;
  /** Description of responsibilities for this shift */
  responsibilities?: string;
  /** Additional notes about the shift */
  notes?: string;
  /** Whether this shift repeats */
  isRecurring?: boolean;
  /** Pattern for recurring shifts (daily, weekly, monthly) */
  recurrencePattern?: string;
}

export interface ShiftUpdate {
  /** Title or description of the shift */
  title: string;
  /** Type of work shift */
  shiftType?: ShiftTypeEnum;
  /** Staff member assigned to this shift */
  assignedStaff: string;
  /** Scheduled start time of the shift */
  startTime: string;
  /** Scheduled end time of the shift */
  endTime: string;
  /** Location where the shift takes place */
  location?: string;
  /** Description of responsibilities for this shift */
  responsibilities?: string;
  /** Additional notes about the shift */
  notes?: string;
  /** Whether this shift repeats */
  isRecurring?: boolean;
  /** Pattern for recurring shifts (daily, weekly, monthly) */
  recurrencePattern?: string;
}

export interface SOSAlert {
  /** UUID primary key */
  id?: string;
  /** Unique identifier for the alert */
  alertId?: string;
  /** User who triggered the alert */
  user: string;
  /** User name */
  userName?: string;
  /** Type of emergency */
  emergencyType: EmergencyTypeEnum;
  /** Emergency type display */
  emergencyTypeDisplay?: string;
  /** Optional description of the emergency */
  description?: string;
  /** Location of the emergency */
  location?: string;
  /** Current status of the alert */
  status?: StatusEnum;
  /** Status display */
  statusDisplay?: string;
  /** Priority level of the alert */
  priority?: PriorityEnum;
  /** Priority display */
  priorityDisplay?: string;
  /** When the alert was acknowledged */
  acknowledgedAt?: string;
  /** User who acknowledged the alert */
  acknowledgedBy?: string;
  /** Acknowledged by name */
  acknowledgedByName?: string;
  /** When response began */
  respondedAt?: string;
  /** User who responded to the alert */
  respondedBy?: string;
  /** Responded by name */
  respondedByName?: string;
  /** When the alert was resolved */
  resolvedAt?: string;
  /** User who resolved the alert */
  resolvedBy?: string;
  /** Resolved by name */
  resolvedByName?: string;
  /** Notes about the resolution */
  resolutionNotes?: string;
  /** When the alert was cancelled */
  cancelledAt?: string;
  /** User who cancelled the alert */
  cancelledBy?: string;
  /** Cancelled by name */
  cancelledByName?: string;
  /** Reason for cancellation */
  cancellationReason?: string;
  /** Response time minutes */
  responseTimeMinutes?: string;
  /** Resolution time minutes */
  resolutionTimeMinutes?: string;
  /** Is active */
  isActive?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface SOSAlertCreate {
  /** Type of emergency */
  emergencyType: EmergencyTypeEnum;
  /** Optional description of the emergency */
  description?: string;
  /** Location of the emergency */
  location?: string;
  /** Priority level of the alert */
  priority?: PriorityEnum;
}

export interface SOSAlertUpdate {
  /** Optional description of the emergency */
  description?: string;
  /** Location of the emergency */
  location?: string;
  /** Priority level of the alert */
  priority?: PriorityEnum;
  /** Notes about the resolution */
  resolutionNotes?: string;
  /** Reason for cancellation */
  cancellationReason?: string;
}

export interface TaskComment {
  /** UUID primary key */
  id?: string;
  /** Content of the comment */
  content: string;
  author?: UserSummary;
  /** Whether this comment is internal (staff only) */
  isInternal?: boolean;
  /** Parent comment */
  parent?: string;
  /** Replies */
  replies?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface TaskCommentCreate {
  /** Content of the comment */
  content: string;
  /** Whether this comment is internal (staff only) */
  isInternal?: boolean;
  /** Parent comment */
  parent?: string;
}

export interface TaskList {
  /** UUID primary key */
  id?: string;
  /** Unique task number for tracking */
  taskNumber?: string;
  /** Brief title describing the task */
  title: string;
  /** Type of task */
  taskType?: TaskTypeEnum;
  /** Priority level of the task */
  priority?: PriorityEnum;
  /** Current status of the task */
  status?: StatusEnum;
  assignedTo?: UserSummary;
  createdBy?: UserSummary;
  /** Expected completion date */
  dueDate?: string;
  /** Location where the task should be performed */
  location?: string;
  /** Estimated time to complete the task in hours */
  estimatedHours?: string;
  /** Actual time spent on the task in hours */
  actualHours?: string;
  escalatedTo?: UserSummary;
  /** Timestamp when task was escalated */
  escalatedAt?: string;
  /** Timestamp when task was started */
  startedAt?: string;
  /** Timestamp when task was completed */
  completedAt?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
  /** Is overdue */
  isOverdue?: string;
  /** Is due soon */
  isDueSoon?: string;
  /** Time remaining */
  timeRemaining?: string;
  /** Duration worked */
  durationWorked?: string;
}

export interface TaskCreate {
  /** Brief title describing the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Type of task */
  taskType?: TaskTypeEnum;
  /** Priority level of the task */
  priority?: PriorityEnum;
  /** Assigned to id */
  assignedToId?: string;
  /** Expected completion date */
  dueDate?: string;
  /** Estimated time to complete the task in hours */
  estimatedHours?: string;
  /** Location where the task should be performed */
  location?: string;
  /** Additional notes about the task */
  notes?: string;
}

export interface TaskAttachment {
  /** UUID primary key */
  id?: string;
  /** Original name of the uploaded file */
  fileName: string;
  /** URL to access the uploaded file */
  fileUrl: string;
  /** Size of the file in bytes */
  fileSize: number;
  /** MIME type of the file */
  fileType: string;
  /** Type of attachment */
  attachmentType?: AttachmentTypeEnum;
  uploadedBy?: UserSummary;
  /** Creation date */
  createdAt?: string;
}

export interface TaskStatusHistory {
  /** UUID primary key */
  id?: string;
  /** Previous status */
  fromStatus?: FromStatusEnum;
  /** New status */
  toStatus: ToStatusEnum;
  changedBy?: UserSummary;
  /** Notes about the status change */
  notes?: string;
  /** Creation date */
  createdAt?: string;
}

export interface TaskEscalationHistory {
  /** UUID primary key */
  id?: string;
  escalatedTo?: UserSummary;
  escalatedBy?: UserSummary;
  /** Reason for escalation */
  reason: string;
  /** Creation date */
  createdAt?: string;
}

export interface TaskDetail {
  /** UUID primary key */
  id?: string;
  /** Unique task number for tracking */
  taskNumber?: string;
  /** Brief title describing the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Type of task */
  taskType?: TaskTypeEnum;
  /** Priority level of the task */
  priority?: PriorityEnum;
  /** Current status of the task */
  status?: StatusEnum;
  assignedTo?: UserSummary;
  createdBy?: UserSummary;
  /** Expected completion date */
  dueDate?: string;
  /** Timestamp when task was started */
  startedAt?: string;
  /** Timestamp when task was completed */
  completedAt?: string;
  /** Estimated time to complete the task in hours */
  estimatedHours?: string;
  /** Actual time spent on the task in hours */
  actualHours?: string;
  /** Location where the task should be performed */
  location?: string;
  /** Additional notes about the task */
  notes?: string;
  /** Notes about task completion */
  completionNotes?: string;
  /** Timestamp when task was escalated */
  escalatedAt?: string;
  escalatedTo?: UserSummary;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  statusHistory?: TaskStatusHistory[];
  escalationHistory?: TaskEscalationHistory[];
  /** Assignment history */
  assignmentHistory?: string;
  /** Is overdue */
  isOverdue?: string;
  /** Is due soon */
  isDueSoon?: string;
  /** Time remaining */
  timeRemaining?: string;
  /** Duration worked */
  durationWorked?: string;
  /** Comments count */
  commentsCount?: string;
}

export interface TaskUpdate {
  /** Brief title describing the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Type of task */
  taskType?: TaskTypeEnum;
  /** Priority level of the task */
  priority?: PriorityEnum;
  /** Assigned to id */
  assignedToId?: string;
  /** Expected completion date */
  dueDate?: string;
  /** Estimated time to complete the task in hours */
  estimatedHours?: string;
  /** Actual time spent on the task in hours */
  actualHours?: string;
  /** Location where the task should be performed */
  location?: string;
  /** Additional notes about the task */
  notes?: string;
}

export interface Bill {
  /** UUID primary key */
  id?: string;
  /** Unique bill number */
  billNumber?: string;
  /** The ID of the user this bill is for (null for cluster-wide bills) */
  userId?: string;
  /** Bill title */
  title: string;
  /** Bill description */
  description?: string;
  /** Type of bill */
  type: TypeEnum;
  /** Bill category (cluster-managed or user-managed) */
  category?: CategoryEnum;
  /** Bill amount */
  amount: string;
  /** Currency code */
  currency?: string;
  /** Users who have acknowledged this bill */
  acknowledgedBy?: string[];
  /** Acknowledgment count */
  acknowledgmentCount?: number;
  /** Whether payment is allowed after due date */
  allowPaymentAfterDue?: boolean;
  /** Is disputed */
  isDisputed?: string;
  /** Dispute count */
  disputeCount?: string;
  /** Bill due date */
  dueDate: string;
  /** Amount already paid */
  paidAmount?: string;
  /** Date and time when bill was paid */
  paidAt?: string;
  /** Remaining amount */
  remainingAmount?: string;
  /** Is overdue */
  isOverdue?: boolean;
  /** Is cluster wide */
  isClusterWide?: boolean;
  /** Is fully paid */
  isFullyPaid?: boolean;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface MembersEmergencyContactSerializer {
  /** UUID primary key */
  id?: string;
  /** Name of the emergency contact */
  name: string;
  /** Contact phone number */
  phoneNumber: string;
  /** Contact email address (optional) */
  email?: string;
  /** List of emergency types this contact handles */
  emergencyTypes?: Record<string, any>;
  /** Contact type */
  contactType: ContactTypeEnum;
  /** Whether this is a primary contact for the emergency types */
  isPrimary?: boolean;
  /** Additional notes about this contact */
  notes?: string;
}

export interface EntryExitLog {
  /** UUID primary key */
  id?: string;
  /** The child this log entry is for */
  child: string;
  /** Child name */
  childName?: string;
  /** The exit request associated with this log */
  exitRequest?: string;
  /** Type of log entry */
  logType: LogTypeEnum;
  /** Date of the entry/exit */
  date: string;
  /** Time when the child exited */
  exitTime?: string;
  /** Time when the child returned */
  entryTime?: string;
  /** Expected time for the child to return */
  expectedReturnTime?: string;
  /** Actual time when the child returned */
  actualReturnTime?: string;
  /** Reason for the exit */
  reason: string;
  /** Where the child went */
  destination?: string;
  /** Name of the adult accompanying the child */
  accompanyingAdult?: string;
  /** Current status of the entry/exit */
  status?: StatusEnum;
  /** Security personnel who verified the exit/entry */
  verifiedBy?: string;
  /** Verified by name */
  verifiedByName?: string;
  /** Additional notes about the entry/exit */
  notes?: string;
  /** Is overdue */
  isOverdue?: string;
  /** Duration minutes */
  durationMinutes?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface ExitRequest {
  /** UUID primary key */
  id?: string;
  /** Unique identifier for the exit request */
  requestId?: string;
  /** The child this exit request is for */
  child: string;
  /** Child name */
  childName?: string;
  /** User who requested the exit */
  requestedBy: string;
  /** Requested by name */
  requestedByName?: string;
  /** Reason for the child's exit */
  reason: string;
  /** Expected time for the child to return */
  expectedReturnTime: string;
  /** Where the child is going */
  destination?: string;
  /** Name of the adult accompanying the child */
  accompanyingAdult?: string;
  /** Phone number of the accompanying adult */
  accompanyingAdultPhone?: string;
  /** Current status of the exit request */
  status?: StatusEnum;
  /** User who approved the exit request */
  approvedBy?: string;
  /** Approved by name */
  approvedByName?: string;
  /** When the exit request was approved */
  approvedAt?: string;
  /** User who denied the exit request */
  deniedBy?: string;
  /** Denied by name */
  deniedByName?: string;
  /** When the exit request was denied */
  deniedAt?: string;
  /** Reason for denying the exit request */
  denialReason?: string;
  /** When the exit request expires */
  expiresAt: string;
  /** Is expired */
  isExpired?: string;
  /** Is pending */
  isPending?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface ExitRequestCreate {
  /** The child this exit request is for */
  child: string;
  /** Reason for the child's exit */
  reason: string;
  /** Expected time for the child to return */
  expectedReturnTime: string;
  /** Where the child is going */
  destination?: string;
  /** Name of the adult accompanying the child */
  accompanyingAdult?: string;
  /** Phone number of the accompanying adult */
  accompanyingAdultPhone?: string;
  /** When the exit request expires */
  expiresAt: string;
}

export interface ExitRequestUpdate {
  /** Reason for the child's exit */
  reason: string;
  /** Expected time for the child to return */
  expectedReturnTime: string;
  /** Where the child is going */
  destination?: string;
  /** Name of the adult accompanying the child */
  accompanyingAdult?: string;
  /** Phone number of the accompanying adult */
  accompanyingAdultPhone?: string;
  /** When the exit request expires */
  expiresAt: string;
}

export interface IssueTicketCreate {
  /** Brief title describing the issue */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Type of issue being reported */
  issueType?: IssueTypeEnum;
  /** Priority level of the issue */
  priority?: PriorityEnum;
}

export interface MemberProfile {
  /** UUID primary key */
  id?: string;
  /** Name of user */
  name: string;
  /** Email address */
  emailAddress?: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** This is the address of the resident in the cluster */
  unitAddress?: string;
  /** Profile image of the user. */
  profileImageUrl?: string;
  /** Property owner */
  propertyOwner?: boolean;
  /** Has this user completed email verification flow? */
  isVerified?: boolean;
  /** Has this user completed phone verification flow? */
  isPhoneVerified?: boolean;
  emergencyContacts?: MembersEmergencyContactSerializer[];
}

export interface MemberRegistration {
  /** Email address */
  emailAddress: string;
  /** Name of user */
  name: string;
  /** The phone number for this subscription in E.164 format. See details: https://www.twilio.com/docs/glossary/what-e164 */
  phoneNumber: string;
  /** This is the address of the resident in the cluster */
  unitAddress?: string;
  /** Password */
  password: string;
  /** Confirm password */
  confirmPassword: string;
  /** Property owner */
  propertyOwner?: boolean;
  /** Cluster id */
  clusterId: string;
}

export interface VisitorLog {
  /** UUID primary key */
  id?: string;
  /** The visitor this log entry is for */
  visitor: string;
  /** Visitor name */
  visitorName?: string;
  /** Date of the log entry */
  date?: string;
  /** Time when the visitor arrived */
  arrivalTime?: string;
  /** Time when the visitor departed */
  departureTime?: string;
  /** Type of log entry */
  logType?: LogTypeEnum;
  /** ID of the user who checked in the visitor */
  checkedInBy?: string;
  /** ID of the user who checked out the visitor */
  checkedOutBy?: string;
  /** Additional notes about the visit */
  notes?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface VisitorCreate {
  /** Full name of the visitor */
  name: string;
  /** Email address of the visitor */
  email?: string;
  /** Phone number of the visitor */
  phone: string;
  /** Expected date and time of arrival */
  estimatedArrival: string;
  /** Type of visit */
  visitType?: VisitTypeEnum;
  /** Validity type of the access code */
  validFor?: ValidForEnum;
  /** Date until which the access code is valid */
  validDate: string;
  /** Purpose or reason for the visit */
  purpose?: string;
  /** Additional notes about the visitor */
  notes?: string;
}

export interface VisitorUpdate {
  /** Full name of the visitor */
  name: string;
  /** Email address of the visitor */
  email?: string;
  /** Phone number of the visitor */
  phone: string;
  /** Expected date and time of arrival */
  estimatedArrival: string;
  /** Type of visit */
  visitType?: VisitTypeEnum;
  /** Current status of the visitor */
  status?: StatusEnum;
  /** Validity type of the access code */
  validFor?: ValidForEnum;
  /** Date until which the access code is valid */
  validDate: string;
  /** Purpose or reason for the visit */
  purpose?: string;
  /** Additional notes about the visitor */
  notes?: string;
}