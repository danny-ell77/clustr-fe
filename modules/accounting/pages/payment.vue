<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payment</h1>
        <p class="text-gray-600">Manage payments and transactions</p>
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <Icon name="plus" class="w-4 h-4 mr-2 inline" />
        New Payment
      </button>
    </div>

    <!-- Under Construction -->
    <UnderConstruction 
      title="Payment Management"
      description="Comprehensive payment processing and transaction management system."
      features={[
        "Multiple payment gateway integration",
        "Recurring payment setup",
        "Payment history and tracking",
        "Refund and dispute management"
      ]}
    />
  </div>
</template>

<script setup>
// Page setup
</script>
