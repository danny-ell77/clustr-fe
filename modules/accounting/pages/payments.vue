<template>
  <div class="p-6 space-y-6">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payments</h1>
        <p class="text-gray-600 mt-1">Track incoming and outgoing payments</p>
      </div>
      
      <Button @click="navigateToForm" class="bg-blue-600 hover:bg-blue-700">
        <Icon name="plus" class="w-4 h-4 mr-2" />
        {{ getAddButtonText }}
      </Button>
    </div>

    <!-- Payment Tabs -->
    <div class="bg-white rounded-lg shadow">
      <DynamicTabs v-model="activeTab" :tabs="tabs">
        <!-- Income Tab -->
        <template #income>
          <div class="p-6 space-y-6">
            <!-- Income Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Total Revenue Card -->
              <Card class="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-medium text-blue-700 mb-2">Total Revenue</h3>
                      <p class="text-2xl font-bold text-blue-900">{{ formatCurrency(totalRevenue) }}</p>
                      <p class="text-xs text-blue-600 mt-1">{{ currentMonth }}</p>
                    </div>
                    <div class="p-2">
                      <Icon name="trending-up" class="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Total Expenses Card -->
              <Card class="bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-medium text-yellow-700 mb-2">Total Expenses</h3>
                      <p class="text-2xl font-bold text-yellow-900">{{ formatCurrency(totalExpenses) }}</p>
                      <p class="text-xs text-yellow-600 mt-1">{{ currentMonth }}</p>
                    </div>
                    <div class="p-2">
                      <Icon name="trending-down" class="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Revenue/Expenses Donut Chart -->
              <Card>
                <CardContent class="p-6">
                  <h3 class="text-sm font-medium text-gray-700 mb-4">Revenue vs Expenses</h3>
                  <div class="flex items-center justify-center">
                    <div class="relative w-32 h-32">
                      <!-- Simplified donut chart representation -->
                      <div class="w-32 h-32 rounded-full border-8 border-blue-200" style="border-top-color: #3B82F6; border-right-color: #3B82F6; border-bottom-color: #FCD34D; border-left-color: #FCD34D; transform: rotate(45deg);"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center transform -rotate-45">
                          <div class="text-xs text-gray-600">Revenue</div>
                          <div class="text-sm font-bold text-blue-600">{{ revenuePercentage }}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 space-y-2">
                    <div class="flex items-center text-xs">
                      <div class="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span>Revenue {{ revenuePercentage }}%</span>
                    </div>
                    <div class="flex items-center text-xs">
                      <div class="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                      <span>Expenses {{ expensesPercentage }}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </template>

        <!-- Expenses Tab -->
        <template #expenses>
          <div class="p-6">
            <!-- Expenses content would go here -->
            <div class="text-gray-500 text-center py-8">
              <Icon name="receipt" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Expenses tracking content</p>
            </div>
          </div>
        </template>

        <!-- Invoice Tab -->
        <template #invoice>
          <div class="p-6 space-y-6">
            <!-- Invoice Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Total Paid -->
              <Card class="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-medium text-blue-700 mb-2">Total paid</h3>
                      <p class="text-2xl font-bold text-blue-900">{{ formatCurrency(invoiceStats.totalPaid) }}</p>
                      <p class="text-xs text-blue-600 mt-1">{{ invoiceStats.paidCount }} invoices</p>
                    </div>
                    <div class="p-2">
                      <Icon name="check-circle" class="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Total Overdue -->
              <Card class="bg-gradient-to-br from-red-50 to-red-100">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-medium text-red-700 mb-2">Total Overdue</h3>
                      <p class="text-2xl font-bold text-red-900">{{ formatCurrency(invoiceStats.totalOverdue) }}</p>
                      <p class="text-xs text-red-600 mt-1">{{ invoiceStats.overdueCount }} invoices</p>
                    </div>
                    <div class="p-2">
                      <Icon name="alert-triangle" class="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Total Draft -->
              <Card class="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-medium text-green-700 mb-2">Total Draft</h3>
                      <p class="text-2xl font-bold text-green-900">{{ formatCurrency(invoiceStats.totalDraft) }}</p>
                      <p class="text-xs text-green-600 mt-1">{{ invoiceStats.draftCount }} invoices</p>
                    </div>
                    <div class="p-2">
                      <Icon name="edit" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </template>
      </DynamicTabs>
    </div>

    <!-- Data Table -->
    <Card>
      <GenericTable
        :data="currentTabData"
        :columns="currentTabColumns"
        :row-actions="tableActions"
        :search-placeholder="getSearchPlaceholder"
        empty-message="No records found"
        @view="viewRecord"
        @edit="editRecord"
        @delete="deleteRecord"
      />
    </Card>

    <!-- Form Modals -->
    <Dialog v-model:open="showIncomeForm">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <IncomeForm @cancel="showIncomeForm = false" />
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showExpenseForm">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ExpenseForm @cancel="showExpenseForm = false" />
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showInvoiceForm">
      <DialogContent class="max-w-6xl max-h-[90vh] overflow-y-auto">
        <InvoiceForm @cancel="showInvoiceForm = false" />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock composables for this example
const useFormatters = () => ({
  formatCurrency: (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(value),
  formatDate: (value) => new Date(value).toLocaleDateString(),
  formatDateLong: (value) => new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const useToast = () => ({
  showToast: (message, type = 'info') => {
    console.log(`Toast: ${message} (${type})`)
  }
})

const { formatCurrency, formatDate, formatDateLong } = useFormatters()
const { showToast } = useToast()

// Tab management
const activeTab = ref('income')
const tabs = [
  { name: 'Income', value: 'income' },
  { name: 'Expenses', value: 'expenses' },
  { name: 'Invoice', value: 'invoice' }
]

// Form modal states
const showIncomeForm = ref(false)
const showExpenseForm = ref(false)
const showInvoiceForm = ref(false)

// Current month for display
const currentMonth = ref('Nov 2023')

// Mock data
const incomeData = ref([
  {
    id: 1,
    date: '2023-11-15',
    method: 'Bank Transfer',
    description: 'Monthly rent payment - Unit 101',
    amount: 250000,
    clientName: 'John Smith',
    invoiceNo: 'INV-2023-001',
    receiptNumber: 'RCP-001'
  },
  {
    id: 2,
    date: '2023-11-14',
    method: 'Cash',
    description: 'Service charge payment',
    amount: 75000,
    clientName: 'Jane Doe',
    invoiceNo: 'INV-2023-002',
    receiptNumber: 'RCP-002'
  },
  {
    id: 3,
    date: '2023-11-13',
    method: 'Check',
    description: 'Utility bill payment',
    amount: 45000,
    clientName: 'Bob Wilson',
    invoiceNo: 'INV-2023-003',
    receiptNumber: 'RCP-003'
  }
])

const expenseData = ref([
  {
    id: 1,
    date: '2023-11-15',
    method: 'Bank Transfer',
    description: 'Electricity bill',
    amount: 85000,
    clientName: 'PHCN',
    invoiceNo: 'EXP-2023-001',
    receiptNumber: 'RCP-EXP-001'
  },
  {
    id: 2,
    date: '2023-11-14',
    method: 'Cash',
    description: 'Water bill',
    amount: 25000,
    clientName: 'Water Corporation',
    invoiceNo: 'EXP-2023-002',
    receiptNumber: 'RCP-EXP-002'
  },
  {
    id: 3,
    date: '2023-11-13',
    method: 'Check',
    description: 'Waste disposal',
    amount: 15000,
    clientName: 'Waste Management Ltd',
    invoiceNo: 'EXP-2023-003',
    receiptNumber: 'RCP-EXP-003'
  }
])

const invoiceData = ref([
  {
    id: 1,
    date: '2023-11-15',
    invoiceStatus: 'Paid',
    description: 'Monthly maintenance fee',
    amount: 180000,
    clientName: 'Estate Residents',
    invoiceNo: 'INV-2023-101'
  },
  {
    id: 2,
    date: '2023-11-10',
    invoiceStatus: 'Overdue',
    description: 'Security services',
    amount: 95000,
    clientName: 'Security Corp',
    invoiceNo: 'INV-2023-102'
  },
  {
    id: 3,
    date: '2023-11-08',
    invoiceStatus: 'Draft',
    description: 'Landscaping services',
    amount: 125000,
    clientName: 'Green Gardens Ltd',
    invoiceNo: 'INV-2023-103'
  }
])

// Computed properties
const totalRevenue = computed(() => 14000000)
const totalExpenses = computed(() => 4000000)

const revenuePercentage = computed(() => {
  const total = totalRevenue.value + totalExpenses.value
  return Math.round((totalRevenue.value / total) * 100)
})

const expensesPercentage = computed(() => {
  const total = totalRevenue.value + totalExpenses.value
  return Math.round((totalExpenses.value / total) * 100)
})

const invoiceStats = computed(() => ({
  totalPaid: 400689,
  paidCount: 5,
  totalOverdue: 400689,
  overdueCount: 7,
  totalDraft: 400689,
  draftCount: 12
}))

const currentTabData = computed(() => {
  switch (activeTab.value) {
    case 'income':
      return incomeData.value
    case 'expenses':
      return expenseData.value
    case 'invoice':
      return invoiceData.value
    default:
      return []
  }
})

const currentTabColumns = computed(() => {
  const baseColumns = [
    {
      key: 'date',
      label: 'DATE',
      format: (value) => formatDate(value)
    },
    {
      key: activeTab.value === 'invoice' ? 'invoiceStatus' : 'method',
      label: activeTab.value === 'invoice' ? 'INVOICE STATUS' : 'METHOD OF PAYMENT',
      format: (value) => value
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      format: (value) => value
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      align: 'right',
      format: (value) => formatCurrency(value)
    },
    {
      key: 'clientName',
      label: 'CLIENT NAME',
      format: (value) => value
    },
    {
      key: 'invoiceNo',
      label: 'INVOICE NO',
      format: (value) => value
    }
  ]
  
  return baseColumns
})

const getAddButtonText = computed(() => {
  switch (activeTab.value) {
    case 'income':
      return 'Add Income'
    case 'expenses':
      return 'Add Expenses'
    case 'invoice':
      return 'Create Invoice'
    default:
      return 'Add'
  }
})

const getSearchPlaceholder = computed(() => {
  switch (activeTab.value) {
    case 'income':
      return 'Search income...'
    case 'expenses':
      return 'Search expenses...'
    case 'invoice':
      return 'Search invoices...'
    default:
      return 'Search...'
  }
})

// Table actions
const tableActions = [
  { key: 'view', label: 'View Details', icon: 'eye' },
  { key: 'edit', label: 'Edit', icon: 'edit-2' },
  { key: 'delete', label: 'Delete', icon: 'trash-2', destructive: true }
]

// Methods
const navigateToForm = () => {
  switch (activeTab.value) {
    case 'income':
      showIncomeForm.value = true
      break
    case 'expenses':
      showExpenseForm.value = true
      break
    case 'invoice':
      showInvoiceForm.value = true
      break
  }
}

const viewRecord = (record) => {
  showToast(`Viewing ${activeTab.value} record`, 'info')
  // Implementation for view record details
}

const editRecord = (record) => {
  showToast(`Editing ${activeTab.value} record`, 'info')
  // Implementation for edit record
}

const deleteRecord = (record) => {
  const dataRef = activeTab.value === 'income' ? incomeData : 
                   activeTab.value === 'expenses' ? expenseData : invoiceData
  
  const index = dataRef.value.findIndex(item => item.id === record.id)
  if (index > -1) {
    dataRef.value.splice(index, 1)
    showToast(`${activeTab.value} record deleted successfully`, 'success')
  }
}
</script>