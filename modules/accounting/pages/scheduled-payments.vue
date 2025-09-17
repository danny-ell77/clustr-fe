<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Scheduled Payments</h1>
        <p class="text-gray-600 mt-1">Manage and view all your scheduled payments</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="exportData">
          <Icon name="download" class="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button @click="showScheduleForm = true" class="bg-blue-600 hover:bg-blue-700">
          <Icon name="plus" class="w-4 h-4 mr-2" />
          Schedule Payment
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card class="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium text-blue-700 mb-2">Total Scheduled</h3>
              <p class="text-2xl font-bold text-blue-900">{{ stats.totalScheduled }}</p>
              <p class="text-xs text-blue-600 mt-1">{{ formatCurrency(stats.totalScheduledAmount) }}</p>
            </div>
            <div class="p-2">
              <Icon name="calendar" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardContent class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium text-yellow-700 mb-2">Due This Week</h3>
              <p class="text-2xl font-bold text-yellow-900">{{ stats.dueThisWeek }}</p>
              <p class="text-xs text-yellow-600 mt-1">{{ formatCurrency(stats.dueThisWeekAmount) }}</p>
            </div>
            <div class="p-2">
              <Icon name="clock" class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium text-green-700 mb-2">Recurring</h3>
              <p class="text-2xl font-bold text-green-900">{{ stats.recurring }}</p>
              <p class="text-xs text-green-600 mt-1">Monthly payments</p>
            </div>
            <div class="p-2">
              <Icon name="repeat" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium text-purple-700 mb-2">One Time</h3>
              <p class="text-2xl font-bold text-purple-900">{{ stats.oneTime }}</p>
              <p class="text-xs text-purple-600 mt-1">Single payments</p>
            </div>
            <div class="p-2">
              <Icon name="zap" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label for="status-filter">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem :value="StatusEnum.active">Active</SelectItem>
                <SelectItem :value="StatusEnum.paused">Paused</SelectItem>
                <SelectItem :value="StatusEnum.cancelled">Cancelled</SelectItem>
                <SelectItem :value="StatusEnum.expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="type-filter">Payment Type</Label>
            <Select v-model="filters.type">
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem :value="TypeEnum.electricity">Electricity</SelectItem>
                <SelectItem :value="TypeEnum.water">Water</SelectItem>
                <SelectItem :value="TypeEnum.internetUtility">Internet</SelectItem>
                <SelectItem :value="TypeEnum.security">Security</SelectItem>
                <SelectItem :value="TypeEnum.cableTvUtility">Cable TV</SelectItem>
                <SelectItem :value="TypeEnum.wasteManagement">Waste Management</SelectItem>
                <SelectItem :value="TypeEnum.serviceCharge">Service Charge</SelectItem>
                <SelectItem :value="TypeEnum.maintenance">Maintenance</SelectItem>
                <SelectItem :value="TypeEnum.other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              v-model="filters.dateFrom"
            />
          </div>

          <div>
            <Label for="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              v-model="filters.dateTo"
            />
          </div>
        </div>

        <div class="flex justify-end mt-4 gap-2">
          <Button variant="outline" @click="clearFilters">
            Clear Filters
          </Button>
          <Button @click="applyFilters">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Data Table -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">Scheduled Payments ({{ filteredPayments.length }})</CardTitle>
          <div class="flex items-center space-x-2">
            <Input
              v-model="searchQuery"
              placeholder="Search payments..."
              class="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <GenericTable
          :data="filteredPayments"
          :columns="columns"
          :row-actions="tableActions"
          empty-message="No scheduled payments found"
          @view="viewPayment"
          @edit="editPayment"
          @cancel="cancelPayment"
          @execute="executePayment"
        />
      </CardContent>
    </Card>

    <!-- Schedule Payment Modal -->
    <Dialog v-model:open="showScheduleForm">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Payment</DialogTitle>
          <DialogDescription>
            Schedule a payment to be executed automatically on a specific date and time.
          </DialogDescription>
        </DialogHeader>
        <SchedulePaymentForm
          @close="showScheduleForm = false"
          @submit="handleSchedulePayment"
        />
      </DialogContent>
    </Dialog>

    <!-- Payment Details Modal -->
    <Dialog v-model:open="showPaymentDetails">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedPayment" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Payment Type</Label>
              <p class="text-sm text-gray-900">{{ formatPaymentType(selectedPayment.type as TypeEnum) }}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge :variant="getStatusVariant(selectedPayment.status as StatusEnum)">
                {{ formatStatus(selectedPayment.status as StatusEnum) }}
              </Badge>
            </div>
            <div>
              <Label>Provider</Label>
              <p class="text-sm text-gray-900">{{ selectedPayment.utilityProviderName }}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(Number(selectedPayment.amount)) }}</p>
            </div>
            <div>
              <Label>Next Payment Date</Label>
              <p class="text-sm text-gray-900">{{ formatDate(new Date(selectedPayment.nextPaymentDate)) }}</p>
            </div>
            <div>
              <Label>Frequency</Label>
              <p class="text-sm text-gray-900">{{ formatFrequency(selectedPayment.frequency) }}</p>
            </div>
          </div>
          
          <div v-if="selectedPayment.description">
            <Label>Description</Label>
            <p class="text-sm text-gray-900">{{ selectedPayment.description }}</p>
          </div>

          <div v-if="selectedPayment.customerId">
            <Label>Customer ID</Label>
            <p class="text-sm text-gray-900">{{ selectedPayment.customerId }}</p>
          </div>

          <div v-if="selectedPayment.endDate">
            <Label>End Date</Label>
            <p class="text-sm text-gray-900">{{ formatDate(new Date(selectedPayment.endDate)) }}</p>
          </div>

          <div class="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" @click="showPaymentDetails = false">
              Close
            </Button>
            <Button
              v-if="selectedPayment.status === StatusEnum.active"
              variant="outline"
              @click="editPayment(selectedPayment)"
            >
              Edit
            </Button>
            <Button
              v-if="selectedPayment.status === StatusEnum.active"
              @click="executePayment(selectedPayment)"
            >
              Execute Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useFormatters } from '~/composables/useFormatters'
import { useToast } from '~/composables/useToast'
import { type RecurringUtilityPayment, StatusEnum, TypeEnum, FrequencyEnum, PaymentSourceEnum, CategoryEnum } from '~/types/accounting'

// Components
import GenericTable from '~/components/shared/GenericTable.vue'
import SchedulePaymentForm from '~/components/accounting/wallet/SchedulePaymentForm.vue'
import Icon from '~/components/Icon.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

definePageMeta({
  title: 'Scheduled Payments',
  description: 'Manage all your scheduled payments'
})

const { formatCurrency, formatDate, formatTime } = useFormatters()
const { success, info } = useToast()

// State
const showScheduleForm = ref(false)
const showPaymentDetails = ref(false)
const selectedPayment = ref<RecurringUtilityPayment | null>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  status: '',
  type: '',
  dateFrom: '',
  dateTo: ''
})

// Mock data
const scheduledPayments = ref<RecurringUtilityPayment[]>([
  {
    id: '1',
    billNumber: 'REC-001',
    title: 'PHCN Monthly Bill',
    description: 'Monthly electricity bill',
    type: TypeEnum.electricity,
    category: CategoryEnum.userManaged,
    amount: '25000',
    currency: 'NGN',
    dueDate: '2023-12-20',
    utilityProvider: 'PHCN',
    utilityProviderName: 'PHCN',
    customerId: 'PHCN123456',
    isAutomated: true,
    frequency: FrequencyEnum.monthly,
    status: StatusEnum.active,
    paymentSource: PaymentSourceEnum.wallet,
    startDate: '2023-11-20',
    nextPaymentDate: '2023-12-20',
    createdAt: '2023-11-15',
    lastModifiedAt: '2023-11-15'
  },
  {
    id: '2',
    billNumber: 'REC-002',
    title: 'Water Corporation Monthly Payment',
    description: 'Monthly water supply payment',
    type: TypeEnum.water,
    category: CategoryEnum.userManaged,
    amount: '15000',
    currency: 'NGN',
    dueDate: '2023-12-22',
    utilityProvider: 'WaterCorp',
    utilityProviderName: 'Water Corporation',
    customerId: 'WATER789012',
    isAutomated: true,
    frequency: FrequencyEnum.monthly,
    status: StatusEnum.active,
    paymentSource: PaymentSourceEnum.wallet,
    startDate: '2023-11-22',
    nextPaymentDate: '2023-12-22',
    createdAt: '2023-11-15',
    lastModifiedAt: '2023-11-15'
  },
  {
    id: '3',
    billNumber: 'REC-003',
    title: 'MTN Internet Subscription',
    description: 'Internet subscription renewal',
    type: TypeEnum.internetUtility,
    category: CategoryEnum.userManaged,
    amount: '12000',
    currency: 'NGN',
    dueDate: '2023-12-25',
    utilityProvider: 'MTN',
    utilityProviderName: 'MTN Nigeria',
    customerId: 'MTN345678',
    isAutomated: true,
    frequency: FrequencyEnum.monthly,
    status: StatusEnum.active,
    paymentSource: PaymentSourceEnum.wallet,
    startDate: '2023-11-25',
    nextPaymentDate: '2023-12-25',
    createdAt: '2023-11-15',
    lastModifiedAt: '2023-11-15'
  },
  {
    id: '4',
    billNumber: 'REC-004',
    title: 'Estate Security Services',
    description: 'Security services payment',
    type: TypeEnum.security,
    category: CategoryEnum.clusterManaged,
    amount: '50000',
    currency: 'NGN',
    dueDate: '2023-12-18',
    utilityProvider: 'SecPlus',
    utilityProviderName: 'Security Plus Ltd',
    customerId: 'SEC901234',
    isAutomated: true,
    frequency: FrequencyEnum.monthly,
    status: StatusEnum.paused,
    paymentSource: PaymentSourceEnum.direct,
    startDate: '2023-11-18',
    nextPaymentDate: '2023-12-18',
    createdAt: '2023-11-10',
    lastModifiedAt: '2023-11-16'
  }])
 
// Computed properties
const filteredPayments = computed(() => {
  let payments = scheduledPayments.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    payments = payments.filter((payment: RecurringUtilityPayment) =>
      payment.utilityProviderName?.toLowerCase().includes(query) ||
      payment.description?.toLowerCase().includes(query) ||
      formatPaymentType(payment.type).toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    payments = payments.filter((payment: RecurringUtilityPayment) => payment.status === filters.value.status)
  }

  // Apply type filter
  if (filters.value.type) {
    payments = payments.filter((payment: RecurringUtilityPayment) => payment.type === filters.value.type)
  }

  // Apply date filters
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    payments = payments.filter((payment: RecurringUtilityPayment) => new Date(payment.nextPaymentDate) >= fromDate)
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    payments = payments.filter((payment: RecurringUtilityPayment) => new Date(payment.nextPaymentDate) <= toDate)
  }

  return payments
})

const stats = computed(() => {
  const total = scheduledPayments.value.length
  const totalAmount = scheduledPayments.value.reduce((sum: number, p: RecurringUtilityPayment) => sum + Number(p.amount), 0)
  
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const dueThisWeek = scheduledPayments.value.filter((p: RecurringUtilityPayment) => {
    const nextPayment = new Date(p.nextPaymentDate)
    return nextPayment >= now && nextPayment <= weekFromNow && p.status === StatusEnum.active
  })

  const recurring = scheduledPayments.value.filter((p: RecurringUtilityPayment) =>
    p.frequency === FrequencyEnum.monthly || p.frequency === FrequencyEnum.weekly || p.frequency === FrequencyEnum.yearly
  ).length

  const oneTime = scheduledPayments.value.filter((p: RecurringUtilityPayment) =>
    p.frequency === FrequencyEnum.daily // Assuming daily represents one-time for this context
  ).length

  return {
    totalScheduled: total,
    totalScheduledAmount: totalAmount,
    dueThisWeek: dueThisWeek.length,
    dueThisWeekAmount: dueThisWeek.reduce((sum: number, p: RecurringUtilityPayment) => sum + Number(p.amount), 0),
    recurring,
    oneTime
  }
})

// Table columns
const columns = [
  {
    key: 'type',
    label: 'TYPE',
    format: (value: TypeEnum) => formatPaymentType(value)
  },
  {
    key: 'utilityProviderName',
    label: 'PROVIDER',
    format: (value: string) => value
  },
  {
    key: 'amount',
    label: 'AMOUNT',
    align: 'right',
    format: (value: string) => formatCurrency(Number(value))
  },
  {
    key: 'nextPaymentDate',
    label: 'NEXT PAYMENT',
    format: (value: string) => formatDate(new Date(value))
  },
  {
    key: 'frequency',
    label: 'FREQUENCY',
    format: (value: FrequencyEnum) => formatFrequency(value)
  },
  {
    key: 'status',
    label: 'STATUS',
    format: (value: StatusEnum) => formatStatus(value)
  },
  {
    key: 'paymentSource',
    label: 'SOURCE',
    format: (value: PaymentSourceEnum) => formatPaymentSource(value)
  }
]

// Table actions
const tableActions = [
  { key: 'view', label: 'View Details', icon: 'eye' },
  { key: 'edit', label: 'Edit', icon: 'edit-2' },
  { key: 'execute', label: 'Execute Now', icon: 'play' },
  { key: 'cancel', label: 'Cancel', icon: 'x-circle', destructive: true }
]

// Methods
const formatPaymentType = (type: TypeEnum): string => {
  const types: Record<string, string> = {
    [TypeEnum.electricity]: 'Electricity',
    [TypeEnum.water]: 'Water',
    [TypeEnum.security]: 'Security',
    [TypeEnum.maintenance]: 'Maintenance',
    [TypeEnum.serviceCharge]: 'Service Charge',
    [TypeEnum.wasteManagement]: 'Waste Management',
    [TypeEnum.electricityUtility]: 'Electricity Utility',
    [TypeEnum.waterUtility]: 'Water Utility',
    [TypeEnum.internetUtility]: 'Internet',
    [TypeEnum.cableTvUtility]: 'Cable TV',
    [TypeEnum.other]: 'Other'
  }
  return types[type] || type
}

const formatStatus = (status: StatusEnum): string => {
  const statuses: Record<string, string> = {
    [StatusEnum.active]: 'Active',
    [StatusEnum.paused]: 'Paused',
    [StatusEnum.cancelled]: 'Cancelled',
    [StatusEnum.expired]: 'Expired'
  }
  return statuses[status] || status
}

const formatFrequency = (frequency: FrequencyEnum): string => {
  const types: Record<string, string> = {
    [FrequencyEnum.daily]: 'Daily',
    [FrequencyEnum.weekly]: 'Weekly',
    [FrequencyEnum.monthly]: 'Monthly',
    [FrequencyEnum.quarterly]: 'Quarterly',
    [FrequencyEnum.yearly]: 'Yearly'
  }
  return types[frequency] || frequency
}

const formatPaymentSource = (source: PaymentSourceEnum): string => {
  const sources: Record<string, string> = {
    [PaymentSourceEnum.wallet]: 'Wallet',
    [PaymentSourceEnum.direct]: 'Direct'
  }
  return sources[source] || source
}

const getStatusVariant = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.active:
      return 'default'
    case StatusEnum.paused:
      return 'secondary'
    case StatusEnum.cancelled:
      return 'destructive'
    case StatusEnum.expired:
      return 'outline'
    default:
      return 'secondary'
  }
}

const clearFilters = () => {
  filters.value = {
    status: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  }
}

const applyFilters = () => {
  success('Filters applied')
}

const exportData = () => {
  info('Exporting scheduled payments...')
}

const handleSchedulePayment = (payment: Partial<RecurringUtilityPayment>) => {
  const newPayment: RecurringUtilityPayment = {
    id: Date.now().toString(),
    billNumber: `REC-${Date.now()}`,
    title: payment.title || '',
    description: payment.description,
    type: payment.type || TypeEnum.other,
    category: payment.category || CategoryEnum.userManaged,
    amount: payment.amount?.toString() || '0',
    currency: payment.currency || 'NGN',
    dueDate: payment.dueDate || new Date().toISOString(),
    utilityProvider: payment.utilityProvider,
    utilityProviderName: payment.utilityProviderName,
    customerId: payment.customerId,
    isAutomated: payment.isAutomated || true,
    frequency: payment.frequency || FrequencyEnum.monthly,
    status: StatusEnum.active,
    paymentSource: payment.paymentSource || PaymentSourceEnum.wallet,
    startDate: payment.startDate || new Date().toISOString(),
    nextPaymentDate: payment.nextPaymentDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString()
  }
  
  scheduledPayments.value.unshift(newPayment)
  showScheduleForm.value = false
  success('Payment scheduled successfully')
}

const viewPayment = (payment: RecurringUtilityPayment) => {
  selectedPayment.value = payment
  showPaymentDetails.value = true
}

const editPayment = (payment: RecurringUtilityPayment) => {
  showPaymentDetails.value = false
  info(`Editing payment: ${payment.utilityProviderName}`)
  // Implementation for edit payment
}

const executePayment = (payment: RecurringUtilityPayment) => {
  const index = scheduledPayments.value.findIndex(p => p.id === payment.id)
  if (index > -1) {
    // Update next payment date and last modified
    const nextDate = new Date(payment.nextPaymentDate)
    scheduledPayments.value[index].nextPaymentDate = nextDate.toISOString()
    scheduledPayments.value[index].lastModifiedAt = new Date().toISOString()
  }
  showPaymentDetails.value = false
  success('Payment execution initiated')
}

const cancelPayment = (payment: RecurringUtilityPayment) => {
  const index = scheduledPayments.value.findIndex(p => p.id === payment.id)
  if (index > -1) {
    scheduledPayments.value[index].status = StatusEnum.cancelled
    scheduledPayments.value[index].lastModifiedAt = new Date().toISOString()
  }
  success('Payment cancelled successfully')
}

onMounted(() => {
  // Load scheduled payments data
})
</script>