<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Total Paid Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Total paid</p>
          <h3 class="text-3xl text-gray-900 mt-1">{{ formatCurrency(metrics.totalPaid) }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ metrics.paidInvoices }} Invoices</p>
        </div>
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="check-circle" class="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>

    <!-- Total Overdue Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Total Overdue</p>
          <h3 class="text-3xl text-gray-900 mt-1">{{ formatCurrency(metrics.totalOverdue) }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ metrics.overdueInvoices }} Invoices</p>
        </div>
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="alert-circle" class="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>

    <!-- Total Draft Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Total Draft</p>
          <h3 class="text-3xl text-gray-900 mt-1">{{ formatCurrency(metrics.totalDraft) }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ metrics.draftInvoices }} Invoices</p>
        </div>
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon name="file" class="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormatters } from '~/composables/useFormatters'
import Icon from '~/components/Icon.vue'

const { formatCurrency } = useFormatters()

defineProps<{
  metrics: {
    totalPaid: number
    totalOverdue: number
    totalDraft: number
    paidInvoices: number
    overdueInvoices: number
    draftInvoices: number
  }
}>()
</script>