
import { Account } from "./auth";
import { StaffSummary } from "./shift";
import { UserSummary } from "./portal";

export interface BaseModel {
  /** UUID primary key */
  id?: string;
  /** Creation date */
  createdAt?: string;
  /** Last modified date */
  lastModifiedAt?: string;
}

export interface BaseAccount {
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
