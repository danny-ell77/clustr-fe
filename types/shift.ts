export enum ShiftTypeEnum {
  SECURITY = "SECURITY",
  MAINTENANCE = "MAINTENANCE",
  CLEANING = "CLEANING",
  RECEPTION = "RECEPTION",
  GARDENING = "GARDENING",
  OTHER = "OTHER",
}

export enum ShiftStatusEnum {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum ShiftSwapStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

interface BaseModel {
  id?: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

interface BaseShift {
  title: string;
  shiftType?: ShiftTypeEnum;
  assignedStaff: string;
  startTime: string;
  endTime: string;
  location?: string;
  responsibilities?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export interface StaffSummary {
  id?: string;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
}

export interface Role {
  id?: number;
  owner?: string;
  name: string;
  description?: string;
  totalSubusers?: number;
  createdAt?: string;
  lastModifiedAt?: string;
  permissions?: string[];
}

export interface ShiftAttendance {
  clockInTime?: string;
  clockOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  totalBreakDuration?: string;
  overtimeHours?: string;
  overtimeHoursDecimal?: string;
  lateArrivalMinutes?: number;
  earlyDepartureMinutes?: number;
  actualWorkDurationHours?: string;
  attendanceNotes?: string;
}

export interface Shift extends BaseModel, BaseShift {
  shiftTypeDisplay?: string;
  assignedStaffDetails?: StaffSummary;
  actualStartTime?: string;
  actualEndTime?: string;
  status?: ShiftStatusEnum;
  statusDisplay?: string;
  durationHours?: string;
  actualDurationHours?: string;
  isOverdue?: string;
  isUpcoming?: string;
  attendance?: ShiftAttendance;
}

export interface ShiftSwapRequest {
  id?: string;
  originalShift: string;
  originalShiftDetails?: Shift;
  requestedBy: string;
  requestedByDetails?: StaffSummary;
  requestedWith: string;
  requestedWithDetails?: StaffSummary;
  targetShift?: string;
  targetShiftDetails?: Shift;
  reason: string;
  status?: ShiftSwapStatusEnum;
  statusDisplay?: string;
  approvedBy?: string;
  approvedByDetails?: StaffSummary;
  approvedAt?: string;
  responseMessage?: string;
  createdAt?: string;
}

export interface ShiftSwapRequestCreate {
  originalShift: string;
  requestedWith: string;
  targetShift?: string;
  reason: string;
}

export interface ShiftList {
  id?: string;
  title: string;
  shiftType?: ShiftTypeEnum;
  shiftTypeDisplay?: string;
  assignedStaffName?: string;
  startTime: string;
  endTime: string;
  status?: ShiftStatusEnum;
  statusDisplay?: string;
  location?: string;
  durationHours?: string;
  isOverdue?: string;
  isUpcoming?: string;
}

export interface ShiftCreate extends BaseShift {}

export interface ShiftUpdate extends BaseShift {}
