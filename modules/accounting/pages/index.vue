<template>
  <div class="p-6">
    <UnderConstruction 
      title="Accounting Module"
      description="This module will provide comprehensive tools for managing your financial operations, including invoicing, payments, and reporting."
      :features="['Invoice Management', 'Payment Tracking', 'Financial Reports', 'Expense Management']"
      :progress="30"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Accounting',
  description: 'Manage financial operations'
})
</script>
