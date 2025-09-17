export enum TypeEnum {
  electricity = "electricity",
  water = "water",
  security = "security",
  maintenance = "maintenance",
  serviceCharge = "service_charge",
  wasteManagement = "waste_management",
  electricityUtility = "electricity_utility",
  waterUtility = "water_utility",
  internetUtility = "internet_utility",
  cableTvUtility = "cable_tv_utility",
  other = "other",
}

export enum CategoryEnum {
  clusterManaged = "cluster_managed",
  userManaged = "user_managed",
}

export enum ProviderTypeEnum {
  electricity = "electricity",
  water = "water",
  security = "security",
  maintenance = "maintenance",
  serviceCharge = "service_charge",
  wasteManagement = "waste_management",
  electricityUtility = "electricity_utility",
  waterUtility = "water_utility",
  internetUtility = "internet_utility",
  cableTvUtility = "cable_tv_utility",
  other = "other",
}

export enum ApiProviderEnum {
  paystack = "paystack",
  flutterwave = "flutterwave",
  bankTransfer = "bank_transfer",
  cash = "cash",
}

export enum FrequencyEnum {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  quarterly = "quarterly",
  yearly = "yearly",
}

export enum StatusEnum {
  active = "active",
  paused = "paused",
  cancelled = "cancelled",
  expired = "expired",
}

export enum PaymentSourceEnum {
  wallet = "wallet",
  direct = "direct",
}

interface BaseModel {
  id?: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface UtilityBill extends Bill {
  utilityProvider?: string;
  utilityProviderName?: string;
  customerId?: string;
  isAutomated?: boolean;
}

export interface UtilityProvider extends BaseModel {
  name: string;
  providerType: ProviderTypeEnum;
  apiProvider: ApiProviderEnum;
  providerCode: string;
  isActive?: boolean;
  supportsValidation?: boolean;
  supportsInfoLookup?: boolean;
  minimumAmount?: string;
  maximumAmount?: string;
  metadata?: Record<string, any>;
}

export interface RecurringUtilityPayment extends UtilityBill {
  frequency: FrequencyEnum;
  status?: StatusEnum;
  paymentSource?: PaymentSourceEnum;
  spendingLimit?: string;
  startDate: string;
  endDate?: string;
  nextPaymentDate: string;
  lastPaymentDate?: string;
  totalPayments?: number;
  failedAttempts?: number;
  maxFailedAttempts?: number;
  nextPaymentInDays?: string;
  canBePaused?: string;
  canBeResumed?: string;
}

export interface Bill extends BaseModel {
  billNumber?: string;
  userId?: string;
  title: string;
  description?: string;
  type: TypeEnum;
  category?: CategoryEnum;
  amount: string;
  currency?: string;
  acknowledgedBy?: string[];
  acknowledgmentCount?: number;
  allowPaymentAfterDue?: boolean;
  isDisputed?: string;
  disputeCount?: string;
  dueDate: string;
  paidAmount?: string;
  paidAt?: string;
  remainingAmount?: string;
  isOverdue?: boolean;
  isClusterWide?: boolean;
  isFullyPaid?: boolean;
}
