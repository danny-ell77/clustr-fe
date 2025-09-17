<!-- Example Management Bills Page - Testing GenericTable Integration -->
<template>
  <div class="bills-management">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bills Management</h1>
        <p class="text-gray-600">Manage and track all property bills and payments</p>
      </div>
      
      <!-- Action buttons with permission checks -->
      <div class="flex items-center space-x-3">
        <Button 
          v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
          @click="showCreateBillModal = true"
          class="bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="plus" class="w-4 h-4 mr-2" />
          Create Bill
        </Button>
        
        <Button 
          v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
          variant="outline"
          @click="showBulkCreateModal = true"
        >
          <Icon name="upload" class="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>
    </div>

    <!-- Filter Panel -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Bill Type Filter -->
          <div>
            <Label>Bill Type</Label>
            <Select @update:model-value="(value) => setFilter('type', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="service_charge">Service Charge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Status Filter -->
          <div>
            <Label>Status</Label>
            <Select @update:model-value="(value) => setFilter('status', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Date Range Filter -->
          <div>
            <Label>Due Date Range</Label>
            <div class="flex space-x-2">
              <Input 
                type="date" 
                @change="updateDateRange"
                placeholder="From"
              />
              <Input 
                type="date" 
                @change="updateDateRange"
                placeholder="To"
              />
            </div>
          </div>

          <!-- Amount Range Filter -->
          <div>
            <Label>Amount Range</Label>
            <div class="flex space-x-2">
              <Input 
                type="number" 
                placeholder="Min"
                @input="updateAmountRange"
              />
              <Input 
                type="number" 
                placeholder="Max"
                @input="updateAmountRange"
              />
            </div>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <div class="text-sm text-gray-600">
            Showing {{ Array.isArray(billsData) ? billsData.length : (billsData as any)?.results?.length || 0 }} bills
            <span v-if="filters.hasActiveFilters">
              (filtered)
            </span>
          </div>
          
          <div class="flex space-x-2">
            <Button variant="outline" size="sm" @click="filters.clearFilters">
              Clear Filters
            </Button>
            <Button variant="outline" size="sm" @click="exportBills">
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Data Table -->
    <Card>
      <GenericTable
        :data="Array.isArray(billsData) ? billsData : (billsData as any)?.results || []"
        :columns="tableColumns"
        :row-actions="tableActions"
        :loading="loading"
        :enable-search="true"
        search-placeholder="Search bills by number, title, or description..."
        empty-message="No bills found matching your criteria"
        @view="viewBill"
        @edit="editBill"
        @delete="deleteBill"
        @search="(query: string) => filters.setSearch(query)"
        @sort="(field: string, order: 'asc' | 'desc') => filters.setSort(field, order)"
      >
        <!-- Custom filter slot -->
        <template #custom-filters>
          <Button 
            variant="outline" 
            size="sm"
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            <Icon name="filter" class="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </template>

        <!-- Custom actions slot -->
        <template #custom-actions>
          <Button 
            v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
            variant="outline" 
            size="sm"
            @click="bulkDelete"
            :disabled="selectedBills.length === 0"
          >
            <Icon name="trash-2" class="w-4 h-4 mr-2" />
            Delete Selected ({{ selectedBills.length }})
          </Button>
        </template>
      </GenericTable>
    </Card>

    <!-- Create Bill Modal -->
    <Dialog v-model:open="showCreateBillModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>
            Add a new bill to the system
          </DialogDescription>
        </DialogHeader>
        
        <div class="p-4 text-center text-gray-500">
          <!-- CreateBillForm component would go here -->
          <p>Create Bill Form - Component not implemented yet</p>
          <Button @click="showCreateBillModal = false" variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Bulk Import Modal -->
    <Dialog v-model:open="showBulkCreateModal">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Bills</DialogTitle>
          <DialogDescription>
            Import multiple bills from a CSV file
          </DialogDescription>
        </DialogHeader>
        
        <div class="p-4 text-center text-gray-500">
          <!-- BulkImportForm component would go here -->
          <p>Bulk Import Form - Component not implemented yet</p>
          <Button @click="showBulkCreateModal = false" variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import GenericTable from '~/components/shared/GenericTable.vue'
import Icon from '~/components/Icon.vue'

// Import composables
const { hasPermission, PERMISSIONS } = usePermissions()
const { $api } = useNuxtApp()

// Page metadata
definePageMeta({
  title: 'Bills Management',
  middleware: ['auth', 'permissions'],
  layout: 'default'
})

// Reactive state
const showCreateBillModal = ref(false)
const showBulkCreateModal = ref(false)
const showAdvancedFilters = ref(false)
const selectedBills = ref<string[]>([])

// **FOCUSED DATA FILTERS** - Just what we need
const filterDefinitions = [
  { field: 'type', type: 'select' as const, label: 'Bill Type', options: [
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'service_charge', label: 'Service Charge' }
  ]},
  { field: 'status', type: 'select' as const, label: 'Status', options: [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ]}
]

// Use the focused filter composable
const filters = useDataFilters(filterDefinitions, {
  persistKey: 'bills-filters',
  onFiltersChange: (query: URLSearchParams) => {
    // This automatically triggers when filters change
    refreshBills()
  }
})

// Simple data fetching with Nuxt's built-in useLazyAsyncData
const { data: billsData, refresh: refreshBills, pending: loading } = useLazyAsyncData(
  'bills',
  () => $api('/bills', {
    query: filters.currentQuery.value
  }),
  {
    watch: [filters.currentQuery] // Auto-refresh when query changes
  }
)

// Table column definitions (simplified)
const tableColumns = [
  { key: 'billNumber', label: 'Bill #', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right' as const, sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

// Table actions with permission checks
const tableActions = computed(() => [
  ...(hasPermission(PERMISSIONS.PAYMENTS.VIEW_BILL) ? [{ key: 'view', label: 'View', icon: 'eye' }] : []),
  ...(hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL) ? [{ key: 'edit', label: 'Edit', icon: 'edit-2' }] : []),
  ...(hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL) ? [{ key: 'delete', label: 'Delete', icon: 'trash-2', destructive: true }] : [])
])

// Simple event handlers
const viewBill = (bill: any) => navigateTo(`/management/payments/bills/${bill.id}`)
const editBill = (bill: any) => navigateTo(`/management/payments/bills/${bill.id}/edit`)

const deleteBill = async (bill: any) => {
  if (!confirm(`Delete bill ${bill.billNumber}?`)) return
  
  await $api(`/bills/${bill.id}`, { method: 'DELETE' })
  refreshBills()
}

// Missing functions that template expects
const bulkDelete = async () => {
  if (!confirm(`Delete ${selectedBills.value.length} selected bills?`)) return
  
  await $api('/bills/bulk-delete', { 
    method: 'DELETE',
    body: { ids: selectedBills.value }
  })
  selectedBills.value = []
  refreshBills()
}

const exportBills = async () => {
  try {
    const response = await $api('/bills/export', {
      query: { format: 'csv', ...filters.currentQuery.value }
    }) as { downloadUrl: string }
    
    // Handle download
    const link = document.createElement('a')
    link.href = response.downloadUrl
    link.download = 'bills-export.csv'
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
  }
}

const onBillCreated = () => {
  showCreateBillModal.value = false
  refreshBills()
}

const onBulkImportSuccess = () => {
  showBulkCreateModal.value = false
  refreshBills()
}

const updateDateRange = (event: Event) => {
  // Handle date range filter updates
  const target = event.target as HTMLInputElement
  filters.setFilter('dateFrom', target.value)
}

const updateAmountRange = (event: Event) => {
  // Handle amount range filter updates
  const target = event.target as HTMLInputElement
  filters.setFilter('amountMin', target.value)
}

// Helper to set filters from UI
const setFilter = (field: string, value: any) => {
  filters.setFilter(field, value)
}
</script>