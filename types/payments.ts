export enum BillType {
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  SERVICE_CHARGE = 'SERVICE_CHARGE',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  OTHER = 'OTHER'
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  BILL_PAYMENT = 'BILL_PAYMENT',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export enum RecurringPaymentFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum RecurringPaymentStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface PaymentError {
  id: string
  transactionId: string
  errorType: string
  severity: string
  providerErrorCode?: string
  providerErrorMessage?: string
  userFriendlyMessage: string
  recoveryOptions: string[]
  retryCount: number
  maxRetries: number
  canRetry: boolean
  isResolved: boolean
  resolvedAt?: string
  resolutionMethod?: string
  adminNotified: boolean
  userNotified: boolean
  metadata: Record<string, any>
  createdAt: string
  lastModifiedAt: string
}

export interface Transaction {
  id: string
  transactionId: string
  reference: string
  type: TransactionType
  amount: string
  currency: string
  status: TransactionStatus
  description: string
  provider: PaymentProvider
  userId: string
  createdAt: string
  processedAt?: string
  failedAt?: string
  failureReason?: string
  failedPayments: PaymentError[]
  metadata: Record<string, any>
}

export interface Bill {
  id: string
  billNumber: string
  userId?: string
  title: string
  description?: string
  type: BillType
  category?: string
  status: BillStatus
  amount: string
  currency: string
  acknowledgedBy: string[]
  acknowledgmentCount: number
  allowPaymentAfterDue: boolean
  isDisputed: boolean
  disputeCount: number
  dueDate: string
  paidAmount: string
  paidAt?: string
  remainingAmount: string
  isOverdue: boolean
  isClusterWide: boolean
  isFullyPaid: boolean
  createdAt: string
  lastModifiedAt: string
}

export interface BillDispute {
  id: string
  bill: string
  billTitle: string
  billAmount: string
  disputedBy: string
  disputedByName: string
  reason: string
  status: string
  adminNotes?: string
  resolvedBy?: string
  resolvedByName?: string
  resolvedAt?: string
  resolutionNotes?: string
  createdAt: string
  lastModifiedAt: string
  isActive: boolean
  daysSinceCreated: number
}

export interface RecurringPayment {
  id: string
  userId: string
  bill?: string
  billTitle?: string
  billAmount?: string
  billStatus?: string
  wallet: string
  title: string
  description?: string
  amount: string
  currency: string
  frequency: RecurringPaymentFrequency
  status: RecurringPaymentStatus
  startDate: string
  endDate?: string
  nextPaymentDate?: string
  lastPaymentDate?: string
  totalPayments: number
  failedAttempts: number
  maxFailedAttempts: number
  utilityProvider?: string
  utilityProviderName?: string
  customerId?: string
  paymentSource: string
  spendingLimit?: string
  metadata: Record<string, any>
  createdAt: string
  lastModifiedAt: string
}

export interface Wallet {
  id: string
  userId: string
  balance: string
  availableBalance: string
  currency: string
  accountNumber: string
  status: WalletStatus
  isPinSet: boolean
  lastTransactionAt?: string
  createdAt: string
  lastModifiedAt: string
}

export interface CreateBillDto {
  userId?: string
  title: string
  description?: string
  type: BillType
  amount: string
  dueDate: string
  allowPaymentAfterDue?: boolean
  metadata?: Record<string, any>
}

export interface BulkBillsDto {
  bills: CreateBillDto[]
}

export interface UpdateBillStatusDto {
  billId: string
  status: BillStatus
}

export interface CreateRecurringPaymentDto {
  billId?: string
  walletId: string
  title: string
  description?: string
  amount: string
  frequency: RecurringPaymentFrequency
  startDate: string
  endDate?: string
  utilityProviderId?: string
  customerId?: string
  paymentSource?: string
  spendingLimit?: string
  metadata?: Record<string, any>
}

export interface UpdateRecurringPaymentDto {
  paymentId: string
  billId?: string
  title?: string
  description?: string
  amount?: string
  frequency?: RecurringPaymentFrequency
  endDate?: string
  utilityProviderId?: string
  customerId?: string
  spendingLimit?: string
  metadata?: Record<string, any>
}

export interface ClusterWalletTransferDto {
  amount: string
  description: string
  recipientAccount?: string
}

export interface ClusterWalletCreditDto {
  amount: string
  description: string
  source?: string
}

export interface PaymentStatistics {
  totalWallets: number
  totalTransactions: number
  totalBills: number
  totalRecurringPayments: number
  totalTransactionVolume: string
  totalPendingBillsAmount: string
}

export interface ClusterWalletInfo {
  balance: string
  availableBalance: string
  currency: string
  status: string
  lastTransactionAt?: string
}

export interface ClusterRevenue {
  periodDays: number
  totalRevenue: string
  billPaymentCount: number
  currentBalance: string
  transactionsCount: number
}

export interface PaymentDashboard {
  statistics: PaymentStatistics
  clusterWallet: ClusterWalletInfo
  clusterRevenue: ClusterRevenue
  recentTransactions: Transaction[]
  recentBills: Bill[]
  errorSummary: Record<string, any>
}

export interface ClusterWalletAnalytics {
  currentBalance: string
  availableBalance: string
  totalDeposits: string
  totalWithdrawals: string
  netBalance: string
  billPaymentRevenue: string
  billPaymentCount: number
  totalTransactions: number
  lastTransactionAt?: string
  walletCreatedAt?: string
}

export interface ClusterWalletResponse {
  analytics: ClusterWalletAnalytics
  recentTransactions: Transaction[]
}

export interface BillSummary {
  totalBills: number
  pendingBills: number
  paidBills: number
  overdueBills: number
  disputedBills: number
  totalAmount: string
  pendingAmount: string
  paidAmount: string
  overdueAmount: string
  disputedAmount: string
  currency: string
}

export interface RecurringPaymentSummary {
  totalPayments: number
  activePayments: number
  pausedPayments: number
  cancelledPayments: number
  totalMonthlyAmount: string
  activeMonthlyAmount: string
  nextPaymentDate?: string
  nextPaymentAmount?: string
  currency: string
}
