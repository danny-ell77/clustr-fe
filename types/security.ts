export type Gender = "male" | "female";
export type EmergencyContactType = "personal" | "estateWide" | "official";
export type EmergencyResponseType =
  | "acknowledged"
  | "dispatched"
  | "onScene"
  | "resolved"
  | "cancelled";

// BASE INTERFACES
interface BaseModel {
  id?: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

interface BaseChild {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  profilePhoto?: string;
  houseNumber: string;
  emergencyContacts?: object;
  notes?: string;
}

interface BaseEmergencyContact {
  name: string;
  phoneNumber: string;
  email?: string;
  emergencyTypes?: object;
  isActive?: boolean;
  isPrimary?: boolean;
  responseTimeMinutes?: number;
  notes?: string;
}

interface BaseGatePass {
  passType?: "visitor" | "delivery" | "artisan";
  visitorName: string;
  vehicleLicensePlate?: string;
}

interface BaseGuest {
  name: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
}

interface BasePanicAlert {
  alertType?: "medical" | "security" | "fire" | "other";
  location?: string;
  notes?: string;
}

interface BaseVisitor {
  name: string;
  email?: string;
  phone: string;
  estimatedArrival: string;
  visitType?: VisitTypeEnum;
  validFor?: ValidForEnum;
  validDate: string;
  purpose?: string;
  notes?: string;
}

interface BaseInvitation {
  visitor: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  recurrenceType?: RecurrenceTypeEnum;
  recurrenceDays?: string;
  recurrenceDayOfMonth?: number;
}

interface BaseSOSAlert {
  emergencyType: EmergencyTypeEnum;
  description?: string;
  location?: string;
  priority?: AlertPriorityEnum;
}

interface BaseExitRequest {
  child: string;
  reason: string;
  expectedReturnTime: string;
  destination?: string;
  accompanyingAdult?: string;
  accompanyingAdultPhone?: string;
  expiresAt: string;
}

// ENUMS
export enum VisitTypeEnum {
  ONE_TIME = "ONE_TIME",
  SHORT_STAY = "SHORT_STAY",
  EXTENDED_STAY = "EXTENDED_STAY",
}

export enum VisitorStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  EXPIRED = "EXPIRED",
}

export enum ValidForEnum {
  ONE_TIME = "ONE_TIME",
  MULTIPLE = "MULTIPLE",
}

export enum RecurrenceTypeEnum {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM",
}

export enum InvitationStatusEnum {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
}

export enum EmergencyTypeEnum {
  health = "health",
  theft = "theft",
  domesticViolence = "domesticViolence",
  fire = "fire",
  security = "security",
  accident = "accident",
  other = "other",
}

export enum AlertStatusEnum {
  active = "active",
  acknowledged = "acknowledged",
  responding = "responding",
  resolved = "resolved",
  cancelled = "cancelled",
  falseAlarm = "falseAlarm",
}

export enum AlertPriorityEnum {
  low = "low",
  medium = "medium",
  high = "high",
  critical = "critical",
}

export enum LogTypeEnum {
  exit = "exit",
  entry = "entry",
}

export enum ExitRequestStatusEnum {
  scheduled = "scheduled",
  inProgress = "inProgress",
  completed = "completed",
  overdue = "overdue",
}

export enum ExitRequestApprovalStatusEnum {
  pending = "pending",
  approved = "approved",
  denied = "denied",
  expired = "expired",
}

export enum VisitorLogTypeEnum {
  SCHEDULED = "SCHEDULED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
}

// REFACTORED INTERFACES
export interface Child extends BaseModel, BaseChild {
  parent: string;
  parentName?: string;
  emergencyContactsDisplay?: string;
  isActive?: boolean;
  age?: string;
}

export interface ChildCreate extends BaseChild { }

export interface ChildUpdate extends BaseChild {
  isActive?: boolean;
}

export interface EmergencyContact extends BaseModel, BaseEmergencyContact {
  emergencyTypesDisplay?: string;
  contactType?: EmergencyContactType;
  contactTypeDisplay?: string;
  user?: string;
  userName?: string;
}

export interface EmergencyContactCreate extends BaseEmergencyContact {
  contactType?: EmergencyContactType;
  user?: string;
}

export interface EmergencyContactUpdate extends BaseEmergencyContact { }

export interface EmergencyResponse extends BaseModel {
  alert: string;
  alertId?: string;
  responder: string;
  responderName?: string;
  responseType: EmergencyResponseType;
  responseTypeDisplay?: string;
  notes?: string;
  estimatedArrival?: string;
  actualArrival?: string;
}

export interface EmergencyResponseCreate {
  alert: string;
  responseType: EmergencyResponseType;
  notes?: string;
  estimatedArrival?: string;
  actualArrival?: string;
}

export interface GatePass extends BaseModel, BaseGatePass {
  passCode?: string;
  entryTime?: string;
  exitTime?: string;
  status?: "active" | "expired" | "used";
  generatedBy: string;
  generatedByName?: string;
}

export interface GatePassCreate extends BaseGatePass { }

export interface GatePassUpdate extends BaseGatePass { }

export interface Guest extends BaseModel, BaseGuest { }

export interface GuestCreate extends BaseGuest { }

export interface GuestUpdate extends BaseGuest { }

export interface PanicAlert extends BaseModel, BasePanicAlert {
  status?: "active" | "acknowledged" | "resolved" | "cancelled";
  triggeredBy: string;
  triggeredByName?: string;
}

export interface PanicAlertCreate extends BasePanicAlert { }

export interface PanicAlertUpdate {
  status?: "active" | "acknowledged" | "resolved" | "cancelled";
  notes?: string;
}

export interface Visitor extends BaseModel, BaseVisitor {
  accessCode?: string;
  invitedBy: string;
  status?: VisitorStatusEnum;
}

export interface VisitorCreate extends BaseVisitor { }

export interface VisitorUpdate extends BaseVisitor {
  status?: VisitorStatusEnum;
}

export interface Permission {
  id?: string;
  name: string;
  codename: string;
  contentType: string;
}

export interface Invitation extends BaseModel, BaseInvitation {
  visitorDetails?: Visitor;
  status?: InvitationStatusEnum;
  createdBy?: string;
  revokedBy?: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface InvitationCreate extends BaseInvitation { }

export interface InvitationUpdate extends BaseInvitation {
  status?: InvitationStatusEnum;
}

export interface InvitationRevoke {
  revocationReason?: string;
}

export interface SOSAlert extends BaseModel, BaseSOSAlert {
  alertId?: string;
  user: string;
  userName?: string;
  emergencyTypeDisplay?: string;
  status?: AlertStatusEnum;
  statusDisplay?: string;
  priorityDisplay?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  acknowledgedByName?: string;
  respondedAt?: string;
  respondedBy?: string;
  respondedByName?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolutionNotes?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelledByName?: string;
  cancellationReason?: string;
  responseTimeMinutes?: string;
  resolutionTimeMinutes?: string;
  isActive?: string;
}

export interface SOSAlertCreate extends BaseSOSAlert { }

export interface SOSAlertUpdate extends BaseSOSAlert {
  resolutionNotes?: string;
  cancellationReason?: string;
}

export interface MembersEmergencyContactSerializer {
  id?: string;
  name: string;
  phoneNumber: string;
  email?: string;
  emergencyTypes?: Record<string, any>;
  contactType: EmergencyContactType;
  isPrimary?: boolean;
  notes?: string;
}

export interface EntryExitLog extends BaseModel {
  child: string;
  childName?: string;
  exitRequest?: string;
  logType: LogTypeEnum;
  date: string;
  exitTime?: string;
  entryTime?: string;
  expectedReturnTime?: string;
  actualReturnTime?: string;
  reason: string;
  destination?: string;
  accompanyingAdult?: string;
  status?: ExitRequestStatusEnum;
  verifiedBy?: string;
  verifiedByName?: string;
  notes?: string;
  isOverdue?: string;
  durationMinutes?: string;
}

export interface ExitRequest extends BaseModel, BaseExitRequest {
  requestId?: string;
  childName?: string;
  requestedBy: string;
  requestedByName?: string;
  status?: ExitRequestApprovalStatusEnum;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  deniedBy?: string;
  deniedByName?: string;
  deniedAt?: string;
  denialReason?: string;
  isExpired?: string;
  isPending?: string;
}

export interface ExitRequestCreate extends BaseExitRequest { }

export interface ExitRequestUpdate extends BaseExitRequest { }

export interface MemberProfile {
  id?: string;
  name: string;
  emailAddress?: string;
  phoneNumber: string;
  unitAddress?: string;
  profileImageUrl?: string;
  propertyOwner?: boolean;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  emergencyContacts?: MembersEmergencyContactSerializer[];
}

export interface MemberRegistration {
  emailAddress: string;
  name: string;
  phoneNumber: string;
  unitAddress?: string;
  password: string;
  confirmPassword: string;
  propertyOwner?: boolean;
  clusterId: string;
}

export interface VisitorLog extends BaseModel {
  visitor: string;
  visitorName?: string;
  date?: string;
  arrivalTime?: string;
  departureTime?: string;
  logType?: VisitorLogTypeEnum;
  checkedInBy?: string;
  checkedOutBy?: string;
  notes?: string;
}
