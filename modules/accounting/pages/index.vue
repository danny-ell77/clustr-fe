<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Accounts</h1>
        <p class="text-gray-600">Financial overview and account management</p>
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <Icon name="plus" class="w-4 h-4 mr-2 inline" />
        Create Invoice
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Paid</p>
            <p class="text-2xl font-bold text-gray-900">₦400,689</p>
            <p class="text-sm text-gray-500">5 invoices</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="trending-up" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Overdue</p>
            <p class="text-2xl font-bold text-red-600">₦400,689</p>
            <p class="text-sm text-gray-500">7 invoices</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="trending-down" class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Draft</p>
            <p class="text-2xl font-bold text-gray-600">₦400,689</p>
            <p class="text-sm text-gray-500">12 invoices</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon name="file-text" class="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Under Construction Notice -->
    <UnderConstruction 
      title="Accounting Dashboard"
      description="Advanced financial reporting and invoice management features are coming soon."
      features={[
        "Invoice generation and tracking",
        "Payment processing integration", 
        "Financial reporting and analytics",
        "Automated billing and reminders"
      ]}
    />
  </div>
</template>

<script setup>
// Page setup
</script>
