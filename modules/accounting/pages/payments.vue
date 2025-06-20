<template>
  <div class="p-6">
    <UnderConstruction 
      title="Payments"
      description="Track all incoming and outgoing payments, reconcile transactions, and manage payment methods."
      :features="['Payment Tracking', 'Transaction Reconciliation', 'Payment History', 'Payment Gateway Integration']"
      :progress="50"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '~/modules/core/components/UnderConstruction.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Payments',
  description: 'Track incoming and outgoing payments'
})
</script>
