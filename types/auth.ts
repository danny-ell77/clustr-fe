// Auth types based on API specification and camelCase convention
// All types use camelCase naming - the case conversion plugin handles snakeCase ↔ camelCase transformation

export enum VerifyModeEnum {
  OTP = "OTP",
  TOKEN = "TOKEN",
}

export enum ModeEnum {
  OTP = "OTP",
  TOKEN = "TOKEN",
  SMS = "SMS",
}

export interface User {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  profileImageUrl?: string;
  isVerified: boolean;
  permissions: string[];
  roles: string[];
}

export interface LoginCredentials {
  emailAddress: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface TokenRefresh {
  refresh: string;
  access?: string;
}

export interface ForgotPasswordRequest {
  emailAddress: string;
  mode?: ModeEnum;
}

export interface ResetPasswordRequest {
  verificationKey: string;
  password: string;
  forceLogout?: boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  forceLogout?: boolean;
}

export interface EmailVerificationRequest {
  emailAddress: string;
  verifyMode: VerifyModeEnum;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Account types for different user roles
export interface Account {
  emailAddress: string;
  name: string;
  phoneNumber: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

export interface StaffAccount extends Account {
  roles: number[];
}

export interface SubuserAccount extends Account {
  permissions?: string[];
}

export interface OwnerAccount extends Account {
  password: string;
  propertyOwner?: boolean;
}

export interface ClusterAdminAccount {
  type?: TypeEnum;
  name: string;
  admin: OwnerAccount;
}

export enum TypeEnum {
  ESTATE = "ESTATE",
  FACILITY = "FACILITY",
  COMMERCIAL = "COMMERCIAL",
  MIXED_USE = "MIXED_USE",
}

export enum FormatEnum {
  CSV = "CSV",
  XLSX = "XLSX",
  XLS = "XLS",
}

export interface _AuthTokenPair {
  access: string;
  refresh: string;
}

export interface ResidentImportedData {
  columnMapping: Record<string, any>;
  format?: FormatEnum;
  hasHeaders: boolean;
  file?: string;
  shouldUpsert?: boolean;
  defaultDialingCode?: string;
}
