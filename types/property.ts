import { Account } from "./auth";
import { UserSummary } from "./portal";

export type MaintenancePriority = "low" | "medium" | "high";
export type MaintenanceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "overdue";
export type MaintenanceRecurrence = "one_time" | "recurring";

// BASE INTERFACES
interface BaseModel {
  id?: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

interface BaseMaintenanceRequest {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

interface BaseProperty {
  name: string;
  address: string;
  propertyType?: "residential" | "commercial" | "mixed_use";
}

interface BaseWorkOrder {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
  maintenanceRequest?: string;
  assignedTo?: string;
}

interface BaseIssueTicket {
  title: string;
  description: string;
  issueType?: IssueTypeEnum;
  priority?: PriorityEnum;
}

interface BaseMaintenanceLog {
  title: string;
  description: string;
  maintenanceType?: MaintenanceTypeEnum;
  propertyType?: PropertyTypeEnum;
  propertyLocation: string;
  equipmentName?: string;
  priority?: PriorityEnum;
  scheduledDate?: string;
  estimatedDuration?: string;
  cost?: string;
  materialsUsed?: string;
  toolsUsed?: string;
  notes?: string;
  nextMaintenanceDue?: string;
  warrantyExpiry?: string;
}

interface BaseMaintenanceSchedule {
  name: string;
  description: string;
  propertyType: PropertyTypeEnum;
  propertyLocation: string;
  equipmentName?: string;
  frequencyType?: FrequencyTypeEnum;
  frequencyValue?: number;
  nextDueDate: string;
  estimatedDuration?: string;
  estimatedCost?: string;
  instructions?: string;
  materialsNeeded?: string;
  toolsNeeded?: string;
}

interface BaseTask {
  title: string;
  description: string;
  taskType?: TaskTypeEnum;
  priority?: PriorityEnum;
  assignedToId?: string;
  dueDate?: string;
  estimatedHours?: string;
  location?: string;
  notes?: string;
}

// REFACTORED INTERFACES
export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string; // YYYY-MM-DD
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  recurrence: MaintenanceRecurrence;
}

export type ResidentImportFormat = "CSV" | "XLSX" | "XLS";

export interface ResidentImportedData {
  columnMapping: object;
  format?: ResidentImportFormat;
  hasHeaders: boolean;
  file?: string;
  shouldUpsert?: boolean;
  defaultDialingCode?: string;
}

export interface MaintenanceRequest extends BaseModel, BaseMaintenanceRequest {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  requestedBy: string;
  requestedByName?: string;
  propertyUnit: string;
}

export interface MaintenanceRequestCreate extends BaseMaintenanceRequest {
  propertyUnit: string;
}

export interface MaintenanceRequestUpdate extends BaseMaintenanceRequest {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
}

export interface Property extends BaseModel, BaseProperty {
  units?: PropertyUnit[];
}

export interface PropertyCreate extends BaseProperty {}

export interface PropertyUpdate extends BaseProperty {}

export interface PropertyUnit extends BaseModel {
  unitNumber: string;
  property: string;
  resident?: string;
  residentName?: string;
}

export interface PropertyUnitCreate {
  unitNumber: string;
  property: string;
  resident?: string;
}

export interface PropertyUnitUpdate {
  unitNumber: string;
  resident?: string;
}

export interface Resident extends BaseModel {
  user: string;
  userName?: string;
  property: string;
  propertyName?: string;
  unit: string;
  unitNumber?: string;
  isOwner?: boolean;
}

export interface WorkOrder extends BaseModel, BaseWorkOrder {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  assignedToName?: string;
}

export interface WorkOrderCreate extends BaseWorkOrder {}

export interface WorkOrderUpdate extends BaseWorkOrder {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
}

export enum IssueTypeEnum {
  CARPENTRY = "CARPENTRY",
  PLUMBING = "PLUMBING",
  ELECTRICAL = "ELECTRICAL",
  CLEANING = "CLEANING",
  SECURITY = "SECURITY",
  OTHER = "OTHER",
}

export enum IssueStatusEnum {
  SUBMITTED = "SUBMITTED",
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum PriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum FromStatusEnum {
  SUBMITTED = "SUBMITTED",
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum ToStatusEnum {
  SUBMITTED = "SUBMITTED",
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum MaintenanceTypeEnum {
  PREVENTIVE = "PREVENTIVE",
  CORRECTIVE = "CORRECTIVE",
  EMERGENCY = "EMERGENCY",
  ROUTINE = "ROUTINE",
  INSPECTION = "INSPECTION",
  UPGRADE = "UPGRADE",
  OTHER = "OTHER",
}

export enum PropertyTypeEnum {
  BUILDING = "BUILDING",
  ELECTRICAL = "ELECTRICAL",
  PLUMBING = "PLUMBING",
  HVAC = "HVAC",
  SECURITY = "SECURITY",
  LANDSCAPING = "LANDSCAPING",
  EQUIPMENT = "EQUIPMENT",
  INFRASTRUCTURE = "INFRASTRUCTURE",
  OTHER = "OTHER",
}

export enum MaintenanceStatusEnum {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  POSTPONED = "POSTPONED",
}

export enum FrequencyTypeEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMI_ANNUAL = "SEMI_ANNUAL",
  ANNUAL = "ANNUAL",
  CUSTOM = "CUSTOM",
}

export enum TaskTypeEnum {
  MAINTENANCE = "MAINTENANCE",
  SECURITY = "SECURITY",
  CLEANING = "CLEANING",
  ADMINISTRATIVE = "ADMINISTRATIVE",
  INSPECTION = "INSPECTION",
  REPAIR = "REPAIR",
  OTHER = "OTHER",
}

export enum TaskStatusEnum {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  OVERDUE = "OVERDUE",
}

export enum AttachmentTypeEnum {
  INSTRUCTION = "INSTRUCTION",
  REFERENCE = "REFERENCE",
  EVIDENCE = "EVIDENCE",
  COMPLETION = "COMPLETION",
  OTHER = "OTHER",
}

export interface IssueTicketList extends BaseModel {
  issueNo?: string;
  title: string;
  issueType?: IssueTypeEnum;
  status?: IssueStatusEnum;
  priority?: PriorityEnum;
  reportedBy?: UserSummary;
  assignedTo?: UserSummary;
  commentsCount?: string;
  dueDate?: string;
}

export interface IssueTicketUpdate extends BaseIssueTicket {
  status?: IssueStatusEnum;
  assignedTo?: string;
  resolutionNotes?: string;
  dueDate?: string;
}

export interface IssueAttachment extends BaseModel {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy?: UserSummary;
}

export interface IssueComment extends BaseModel {
  content: string;
  author?: UserSummary;
  isInternal?: boolean;
  parent?: string;
  attachments?: IssueAttachment[];
  replies?: string;
}

export interface IssueStatusHistory extends BaseModel {
  fromStatus?: FromStatusEnum;
  toStatus: ToStatusEnum;
  changedBy?: UserSummary;
  notes?: string;
}

export interface IssueTicketDetail extends BaseModel, BaseIssueTicket {
  issueNo?: string;
  status?: IssueStatusEnum;
  reportedBy?: UserSummary;
  assignedTo?: UserSummary;
  comments?: IssueComment[];
  attachments?: IssueAttachment[];
  statusHistory?: IssueStatusHistory[];
  commentsCount?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  closedAt?: string;
  escalatedAt?: string;
  dueDate?: string;
}

export interface IssueAttachmentCreate {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface IssueCommentCreate {
  content: string;
  isInternal?: boolean;
  parent?: string;
}

export interface IssueTicketCreate extends BaseIssueTicket {}

export interface MaintenanceLog extends BaseModel, BaseMaintenanceLog {
  maintenanceNumber?: string;
  maintenanceTypeDisplay?: string;
  propertyTypeDisplay?: string;
  priorityDisplay?: string;
  status?: MaintenanceStatusEnum;
  statusDisplay?: string;
  performedBy?: Account;
  supervisedBy?: Account;
  requestedBy?: Account;
  startedAt?: string;
  completedAt?: string;
  actualDuration?: string;
  completionNotes?: string;
  isUnderWarranty?: boolean;
  isOverdue?: string;
  isDueSoon?: string;
  timeRemaining?: string;
  durationWorked?: string;
  attachmentsCount?: string;
  commentsCount?: string;
  totalCost?: string;
}

export interface MaintenanceLogCreate extends BaseMaintenanceLog {}

export interface MaintenanceLogUpdate extends BaseMaintenanceLog {
  status?: MaintenanceStatusEnum;
  actualDuration?: string;
  completionNotes?: string;
}

export interface MaintenanceSchedule extends BaseModel, BaseMaintenanceSchedule {
  propertyTypeDisplay?: string;
  frequencyTypeDisplay?: string;
  assignedTo?: Account;
  isActive?: boolean;
}

export interface MaintenanceScheduleCreate extends BaseMaintenanceSchedule {}

export interface TaskComment extends BaseModel {
  content: string;
  author?: UserSummary;
  isInternal?: boolean;
  parent?: string;
  replies?: string;
}

export interface TaskCommentCreate {
  content: string;
  isInternal?: boolean;
  parent?: string;
}

export interface TaskList extends BaseModel {
  taskNumber?: string;
  title: string;
  taskType?: TaskTypeEnum;
  priority?: PriorityEnum;
  status?: TaskStatusEnum;
  assignedTo?: UserSummary;
  createdBy?: UserSummary;
  dueDate?: string;
  location?: string;
  estimatedHours?: string;
  actualHours?: string;
  escalatedTo?: UserSummary;
  escalatedAt?: string;
  startedAt?: string;
  completedAt?: string;
  isOverdue?: string;
  isDueSoon?: string;
  timeRemaining?: string;
  durationWorked?: string;
}

export interface TaskCreate extends BaseTask {}

export interface TaskAttachment extends BaseModel {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  attachmentType?: AttachmentTypeEnum;
  uploadedBy?: UserSummary;
}

export interface TaskStatusHistory extends BaseModel {
  fromStatus?: FromStatusEnum;
  toStatus: ToStatusEnum;
  changedBy?: UserSummary;
  notes?: string;
}

export interface TaskEscalationHistory extends BaseModel {
  escalatedTo?: UserSummary;
  escalatedBy?: UserSummary;
  reason: string;
}

export interface TaskDetail extends BaseModel, BaseTask {
  taskNumber?: string;
  status?: TaskStatusEnum;
  assignedTo?: UserSummary;
  createdBy?: UserSummary;
  startedAt?: string;
  completedAt?: string;
  actualHours?: string;
  completionNotes?: string;
  escalatedAt?: string;
  escalatedTo?: UserSummary;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  statusHistory?: TaskStatusHistory[];
  escalationHistory?: TaskEscalationHistory[];
  assignmentHistory?: string;
  isOverdue?: string;
  isDueSoon?: string;
  timeRemaining?: string;
  durationWorked?: string;
  commentsCount?: string;
}

export interface TaskUpdate extends BaseTask {
  actualHours?: string;
}
