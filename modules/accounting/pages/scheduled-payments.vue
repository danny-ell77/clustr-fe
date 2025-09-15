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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water_supply">Water Supply</SelectItem>
                <SelectItem value="internet">Internet</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="cable_tv">Cable TV</SelectItem>
                <SelectItem value="waste_disposal">Waste Disposal</SelectItem>
                <SelectItem value="property_tax">Property Tax</SelectItem>
                <SelectItem value="service_charge">Service Charge</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
        <DataTable
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
              <p class="text-sm text-gray-900">{{ formatPaymentType(selectedPayment.type) }}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge :variant="getStatusVariant(selectedPayment.status)">
                {{ formatStatus(selectedPayment.status) }}
              </Badge>
            </div>
            <div>
              <Label>Recipient</Label>
              <p class="text-sm text-gray-900">{{ selectedPayment.recipient }}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(selectedPayment.amount) }}</p>
            </div>
            <div>
              <Label>Scheduled Date</Label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedPayment.date) }}</p>
            </div>
            <div>
              <Label>Scheduled Time</Label>
              <p class="text-sm text-gray-900">{{ selectedPayment.time }}</p>
            </div>
          </div>
          
          <div v-if="selectedPayment.description">
            <Label>Description</Label>
            <p class="text-sm text-gray-900">{{ selectedPayment.description }}</p>
          </div>

          <div v-if="selectedPayment.notes">
            <Label>Notes</Label>
            <p class="text-sm text-gray-900">{{ selectedPayment.notes }}</p>
          </div>

          <div v-if="selectedPayment.recurringType && selectedPayment.recurringType !== 'none'">
            <Label>Recurring</Label>
            <p class="text-sm text-gray-900">
              {{ formatRecurringType(selectedPayment.recurringType) }}
              <span v-if="selectedPayment.recurringEndDate">
                until {{ formatDate(selectedPayment.recurringEndDate) }}
              </span>
            </p>
          </div>

          <div class="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" @click="showPaymentDetails = false">
              Close
            </Button>
            <Button
              v-if="selectedPayment.status === 'scheduled'"
              variant="outline"
              @click="editPayment(selectedPayment)"
            >
              Edit
            </Button>
            <Button
              v-if="selectedPayment.status === 'scheduled'"
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
import type { ScheduledPayment, PaymentStatus, PaymentType } from '~/types/accounting'

// Components
import DataTable from '~/components/shared/DataTable.vue'
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
const { showToast } = useToast()

// State
const showScheduleForm = ref(false)
const showPaymentDetails = ref(false)
const selectedPayment = ref<ScheduledPayment | null>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  status: '',
  type: '',
  dateFrom: '',
  dateTo: ''
})

// Mock data
const scheduledPayments = ref<ScheduledPayment[]>([
  {
    id: '1',
    type: 'electricity',
    recipient: 'PHCN',
    description: 'Monthly electricity bill',
    amount: 25000,
    date: new Date('2023-11-20'),
    time: '10:00 AM',
    status: 'scheduled',
    recurringType: 'monthly',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: '2',
    type: 'water_supply',
    recipient: 'Water Corporation',
    description: 'Monthly water supply payment',
    amount: 15000,
    date: new Date('2023-11-22'),
    time: '02:00 PM',
    status: 'scheduled',
    recurringType: 'monthly',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: '3',
    type: 'internet',
    recipient: 'MTN',
    description: 'Internet subscription renewal',
    amount: 12000,
    date: new Date('2023-11-25'),
    time: '09:00 AM',
    status: 'scheduled',
    recurringType: 'monthly',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: '4',
    type: 'security',
    recipient: 'Security Plus Ltd',
    description: 'Estate security services',
    amount: 50000,
    date: new Date('2023-11-18'),
    time: '11:00 AM',
    status: 'pending',
    recurringType: 'none',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-16')
  },
  {
    id: '5',
    type: 'property_tax',
    recipient: 'Lagos State Government',
    description: 'Annual property tax payment',
    amount: 75000,
    date: new Date('2023-12-01'),
    time: '10:00 AM',
    status: 'scheduled',
    recurringType: 'yearly',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01')
  },
  {
    id: '6',
    type: 'maintenance',
    recipient: 'Estate Management',
    description: 'Quarterly maintenance fee',
    amount: 45000,
    date: new Date('2023-11-30'),
    time: '03:00 PM',
    status: 'scheduled',
    recurringType: 'none',
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05')
  }
])

// Computed properties
const filteredPayments = computed(() => {
  let payments = scheduledPayments.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    payments = payments.filter(payment =>
      payment.recipient.toLowerCase().includes(query) ||
      payment.description?.toLowerCase().includes(query) ||
      formatPaymentType(payment.type).toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    payments = payments.filter(payment => payment.status === filters.value.status)
  }

  // Apply type filter
  if (filters.value.type) {
    payments = payments.filter(payment => payment.type === filters.value.type)
  }

  // Apply date filters
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    payments = payments.filter(payment => payment.date >= fromDate)
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    payments = payments.filter(payment => payment.date <= toDate)
  }

  return payments
})

const stats = computed(() => {
  const total = scheduledPayments.value.length
  const totalAmount = scheduledPayments.value.reduce((sum, p) => sum + p.amount, 0)
  
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  const dueThisWeek = scheduledPayments.value.filter(p => 
    p.date >= now && p.date <= weekFromNow && p.status === 'scheduled'
  )
  
  const recurring = scheduledPayments.value.filter(p => 
    p.recurringType && p.recurringType !== 'none'
  ).length
  
  const oneTime = scheduledPayments.value.filter(p => 
    !p.recurringType || p.recurringType === 'none'
  ).length

  return {
    totalScheduled: total,
    totalScheduledAmount: totalAmount,
    dueThisWeek: dueThisWeek.length,
    dueThisWeekAmount: dueThisWeek.reduce((sum, p) => sum + p.amount, 0),
    recurring,
    oneTime
  }
})

// Table columns
const columns = [
  {
    key: 'type',
    label: 'TYPE',
    format: (value: PaymentType) => formatPaymentType(value)
  },
  {
    key: 'recipient',
    label: 'RECIPIENT',
    format: (value: string) => value
  },
  {
    key: 'amount',
    label: 'AMOUNT',
    align: 'right',
    format: (value: number) => formatCurrency(value)
  },
  {
    key: 'date',
    label: 'SCHEDULED DATE',
    format: (value: Date) => formatDate(value)
  },
  {
    key: 'time',
    label: 'TIME',
    format: (value: string) => value
  },
  {
    key: 'status',
    label: 'STATUS',
    format: (value: PaymentStatus) => formatStatus(value)
  },
  {
    key: 'recurringType',
    label: 'RECURRING',
    format: (value: string) => value && value !== 'none' ? formatRecurringType(value) : 'One-time'
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
const formatPaymentType = (type: PaymentType): string => {
  const types = {
    electricity: 'Electricity',
    water_supply: 'Water Supply',
    internet: 'Internet',
    security: 'Security',
    cable_tv: 'Cable TV',
    waste_disposal: 'Waste Disposal',
    property_tax: 'Property Tax',
    service_charge: 'Service Charge',
    maintenance: 'Maintenance',
    other: 'Other'
  }
  return types[type] || type
}

const formatStatus = (status: PaymentStatus): string => {
  const statuses = {
    scheduled: 'Scheduled',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

const formatRecurringType = (type: string): string => {
  const types = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  }
  return types[type] || type
}

const getStatusVariant = (status: PaymentStatus) => {
  switch (status) {
    case 'scheduled':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'processing':
      return 'outline'
    case 'completed':
      return 'secondary'
    case 'failed':
      return 'destructive'
    case 'cancelled':
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
  showToast('Filters applied', 'success')
}

const exportData = () => {
  showToast('Exporting scheduled payments...', 'info')
}

const handleSchedulePayment = (payment: Partial<ScheduledPayment>) => {
  const newPayment: ScheduledPayment = {
    id: Date.now().toString(),
    type: payment.type || 'other',
    recipient: payment.recipient || '',
    description: payment.description,
    amount: payment.amount || 0,
    date: payment.date || new Date(),
    time: payment.time || '10:00 AM',
    status: 'scheduled',
    recurringType: payment.recurringType || 'none',
    recurringEndDate: payment.recurringEndDate,
    notes: payment.notes,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  scheduledPayments.value.unshift(newPayment)
  showScheduleForm.value = false
  showToast('Payment scheduled successfully', 'success')
}

const viewPayment = (payment: ScheduledPayment) => {
  selectedPayment.value = payment
  showPaymentDetails.value = true
}

const editPayment = (payment: ScheduledPayment) => {
  showPaymentDetails.value = false
  showToast(`Editing payment: ${payment.recipient}`, 'info')
  // Implementation for edit payment
}

const executePayment = (payment: ScheduledPayment) => {
  const index = scheduledPayments.value.findIndex(p => p.id === payment.id)
  if (index > -1) {
    scheduledPayments.value[index].status = 'processing'
    scheduledPayments.value[index].updatedAt = new Date()
  }
  showPaymentDetails.value = false
  showToast('Payment execution initiated', 'success')
}

const cancelPayment = (payment: ScheduledPayment) => {
  const index = scheduledPayments.value.findIndex(p => p.id === payment.id)
  if (index > -1) {
    scheduledPayments.value[index].status = 'cancelled'
    scheduledPayments.value[index].updatedAt = new Date()
  }
  showToast('Payment cancelled successfully', 'success')
}

onMounted(() => {
  // Load scheduled payments data
})
</script>